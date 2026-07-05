import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SessionRepository } from '../repositories/session.repository';
import { KnowledgeService } from '../services/knowledge.service';
import { LLMService } from '../services/llm.service';
import { config } from '../config';

export class ChatController {
  /**
   * Processes user messages, builds the consolidated business context, queries the Master LLM Copilot,
   * saves dialogue logs in history, and returns the executive assistant's reply.
   */
  static async message(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId, sessionId, message, businessData } = req.body;

      if (!organizationId || !message) {
        return res.status(400).json({ error: 'Organization ID and message body are required' });
      }

      let responseText: string | null = null;
      let targetSessionId = sessionId;
      let context: any = null;
      let historySummary = '';
      let agentMemoriesSummary = '';
      let metricsSummary = '';
      
      // Fallback context variables populated from request payload if DB is unreachable or empty
      let companyName = businessData?.company_name || 'Our Company';
      let companyIndustry = businessData?.industry || 'Technology';
      let profileDesc = businessData?.businessDescription || 'Not specified';
      let targetAudience = businessData?.target_audience || 'Mid-market B2B SaaS';
      let competitors = 'Not specified';
      let businessModel = 'Not specified';
      let profileGoals = 'None specified';
      let profileChallenges = 'None specified';
      let useFallbackChat = false;

      let debateArray: any[] = [];

      try {
        // Attempt database operations to compile context and save logs
        if (!targetSessionId) {
          const sessions = await SessionRepository.listSessions(organizationId).catch(err => {
            throw new Error(`[Database] Failed to list sessions: ${err.message}`);
          });
          if (sessions.length > 0) {
            targetSessionId = sessions[0].id;
          } else {
            const newSession = await SessionRepository.createSession(organizationId, 'Chat Workspace').catch(err => {
              throw new Error(`[Database] Failed to create session: ${err.message}`);
            });
            targetSessionId = newSession.id;
          }
        }

        // 1. Log the user prompt
        await SessionRepository.addChatMessage(targetSessionId, 'user', message).catch(err => {
          throw new Error(`[Database] Failed to log user message: ${err.message}`);
        });

        // 2. Fetch the central BusinessContext (encapsulated records compile)
        try {
          context = await KnowledgeService.buildContext(organizationId, targetSessionId);
        } catch (err: any) {
          throw new Error(`[KnowledgeService] Failed to build BusinessContext: ${err.message}`);
        }

        // 3. Compile dialogue logs, metrics, and agent memories matching types definition
        historySummary = context.chatHistory
          .map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`)
          .join('\n');

        agentMemoriesSummary = Object.entries(context.agentMemory)
          .map(([agentName, a]: any) => `[${agentName} Agent Findings]:\n- Summary: ${a.summary}\n- Issues: ${a.issues.join(', ')}\n- Recommendations: ${a.recommendations.join(', ')}`)
          .join('\n\n');

        // Extract raw context metrics if available
        const rawCtx = context.profile?.rawContext || {};
        const fin = rawCtx.financialMetrics || {};
        const sales = rawCtx.salesMetrics || {};
        const mkt = rawCtx.marketingMetrics || {};
        const cust = rawCtx.customerMetrics || {};

        metricsSummary = `
Financial Metrics:
- Monthly Revenue: ${fin.monthlyRevenue !== null && fin.monthlyRevenue !== undefined ? `₹${fin.monthlyRevenue}` : 'N/A'}
- Monthly Expenses: ${fin.monthlyExpenses !== null && fin.monthlyExpenses !== undefined ? `₹${fin.monthlyExpenses}` : 'N/A'}
- Gross Profit: ${fin.grossProfit !== null && fin.grossProfit !== undefined ? `₹${fin.grossProfit}` : 'N/A'}
- Net Profit: ${fin.netProfit !== null && fin.netProfit !== undefined ? `₹${fin.netProfit}` : 'N/A'}
- Profit Margin: ${fin.profitMargin !== null && fin.profitMargin !== undefined ? `${fin.profitMargin}%` : 'N/A'}
- CAC: ${fin.customerAcquisitionCost !== null && fin.customerAcquisitionCost !== undefined ? `₹${fin.customerAcquisitionCost}` : 'N/A'}
- LTV: ${fin.customerLifetimeValue !== null && fin.customerLifetimeValue !== undefined ? `₹${fin.customerLifetimeValue}` : 'N/A'}

Sales & Marketing Metrics:
- Monthly Leads: ${sales.monthlyLeads || 'N/A'}
- Qualified Leads: ${sales.qualifiedLeads || 'N/A'}
- Conversion Rate: ${sales.conversionRate !== null && sales.conversionRate !== undefined ? `${sales.conversionRate}%` : 'N/A'}
- Average Sales Cycle: ${sales.averageSalesCycle !== null && sales.averageSalesCycle !== undefined ? `${sales.averageSalesCycle} days` : 'N/A'}
- Monthly Marketing Spend: ${mkt.monthlyMarketingSpend !== null && mkt.monthlyMarketingSpend !== undefined ? `₹${mkt.monthlyMarketingSpend}` : 'N/A'}
- Website Visitors: ${mkt.websiteVisitors || 'N/A'}

Customer Metrics:
- Active Customers: ${cust.activeCustomers || 'N/A'}
- Retention Rate: ${cust.retentionRate !== null && cust.retentionRate !== undefined ? `${cust.retentionRate}%` : 'N/A'}
- Churn Rate: ${cust.churnRate !== null && cust.churnRate !== undefined ? `${cust.churnRate}%` : 'N/A'}
- NPS: ${cust.nps || 'N/A'}
- Customer Satisfaction: ${cust.customerSatisfaction !== null && cust.customerSatisfaction !== undefined ? `${cust.customerSatisfaction}%` : 'N/A'}
        `.trim();

        // Overwrite fallback variables using loaded database records
        companyName = context.organization.name;
        companyIndustry = context.organization.industry;
        profileDesc = context.profile?.businessDescription || context.profile?.description || 'Not specified';
        targetAudience = context.profile?.targetAudience || 'Not specified';
        competitors = context.profile?.competitors || 'Not specified';
        businessModel = context.profile?.businessModel || 'Not specified';
        
        profileGoals = context.profile?.goals && context.profile.goals.length > 0
          ? context.profile.goals.map((g: any) => `- [${g.goalType}] ${g.description} (Target: ${g.targetValue || 'N/A'}, Priority: ${g.priority})`).join('\n')
          : 'None specified';
          
        profileChallenges = context.profile?.challenges && context.profile.challenges.length > 0
          ? context.profile.challenges.map((c: any) => `- [${c.category}] ${c.description} (Severity: ${c.severity})`).join('\n')
          : 'None specified';

      } catch (dbOrKnowledgeError: any) {
        console.warn('[ChatController] DB / Knowledge compilation failed. Redirecting to direct direct LLM chat processing.', dbOrKnowledgeError.message || dbOrKnowledgeError);
        useFallbackChat = true;
      }

      interface AgentDebateItem {
        agent: string;
        icon: string;
        role: string;
        responsibility: string;
        input: string;
        output: string;
        text: string;
      }

      interface DebateResponse {
        debate: AgentDebateItem[];
      }

      if (!useFallbackChat) {
        try {
          // 4. Construct instruction and prompt templates
          const systemInstruction = `You are Aegis, the Multi-Agent Boardroom Growth Copilot.
Instead of responding as a single chatbot, you must simulate a boardroom discussion between 5 distinct growth agents solving the user's strategic question:
1. 👔 CEO Agent (Role: Chief Executive Officer | Responsibility: Initial alignment, direction and final approval | Input: User strategic question | Output: Executive command mandate)
2. 🧭 Strategy Agent (Role: Chief Strategy Architect | Responsibility: Strategic runway calculation & competitive moats | Input: CEO mandate & industry metrics | Output: Growth roadmap blueprint)
3. 📣 Marketing Agent (Role: Chief Marketing Officer | Responsibility: Ad hook copy, content calendar & target channels | Input: Strategy blueprint | Output: 360 Campaign brief)
4. 🎯 Sales Agent (Role: Chief Revenue Officer | Responsibility: Funnel conversions & outbound touch sequence | Input: Marketing campaign mix | Output: Outbound scripts & pipeline protocol)
5. 💹 Finance Agent (Role: Chief Financial Officer | Responsibility: Budget audits, runway check & unit economics board | Input: Sales conversions & CAC targets | Output: Risk audits & feasibility score)

CRITICAL INSTRUCTIONS:
1. CONTEXT INTEGRATION (ALWAYS ENGAGED): You must NEVER speak generically or output generic advice. For any query (including greetings like "hello"), you must speak as the boardroom representing the active company: "${companyName}" (Industry: "${companyIndustry}").
2. Explicitly reference in the conversation:
   - What company you represent: "${companyName}"
   - What you sell / your product/service overview: "${profileDesc}"
   - Who your target customers/audience are: "${targetAudience}"
For example, if the user says "hello", the CEO Agent must welcome the user to the boardroom of "${companyName}", mention that you are scaling in the "${companyIndustry}" space targeting "${targetAudience}", and prompt the board to analyze how to optimize outcomes. The subsequent agents must continue the discussion explicitly citing these metrics and details.
3. DATA-DRIVEN RATING & AUDITING: When asked to rate or audit the business, perform a rigorous, data-driven assessment using the available KPIs, metrics, and agent findings. If certain metrics are N/A or missing, explicitly state which specific data points are absent while assessing the rest, instead of asking the user to re-enter all details.
4. KNOWLEDGE SUMMARIZATION: When asked what you know about the company, summarize the exact company overview, goals, bottlenecks, metrics, and boardroom memories provided below. Do not prompt the user to write their profile again.
5. PROFESSIONAL UNDER-THE-HOOD BEHAVIOR: Never expose internal technical or implementation details (such as PostgreSQL databases, SQL queries, backend APIs, JSON schemas, or "BusinessContext" objects). Keep all operations strictly business-focused.

You have access to the following live company information:
- Company Name: ${companyName} (Industry: ${companyIndustry})
- Overview: ${profileDesc}
- Business Model: ${businessModel}
- Target Audience: ${targetAudience}
- Key Competitors: ${competitors}

Business Goals:
${profileGoals}

Strategic Bottlenecks & Challenges:
${profileChallenges}

Current Live Business Metrics:
${metricsSummary}

Intermediate Domain Agent Findings:
${agentMemoriesSummary || 'No boardroom simulation reports exist yet.'}

Format the output strictly as a JSON object of this structure:
{
  "debate": [
    {
      "agent": "...",
      "icon": "...",
      "role": "...",
      "responsibility": "...",
      "input": "...",
      "output": "...",
      "text": "..."
    }
  ]
}`;

          const prompt = `Conversation History:
${historySummary}

User Question: ${message}`;

          // 5. Generate response using load balanced LLMService
          let debate: AgentDebateItem[] = [];
          try {
            const resJson = await LLMService.askJson<DebateResponse>(prompt, systemInstruction);
            if (resJson && resJson.debate && Array.isArray(resJson.debate)) {
              debate = resJson.debate;
            } else {
              throw new Error('Invalid debate array in JSON response');
            }
          } catch (err) {
            console.warn('[ChatController] askJson failed, querying text and splitting:', err);
            const rawText = await LLMService.ask(prompt, systemInstruction) || '';
            debate = [
              {
                agent: 'CEO Agent',
                icon: '👔',
                role: 'Chief Executive Officer',
                responsibility: 'Sets high-level targets and coordinates strategies',
                input: 'User strategic request',
                output: 'Executive boardroom blueprint',
                text: rawText
              }
            ];
          }

          responseText = debate.map(d => `### ${d.icon} ${d.agent} (${d.role})\n**Responsibility**: ${d.responsibility}\n**Input**: ${d.input}\n**Output**: ${d.output}\n\n${d.text}`).join('\n\n---\n\n');
          debateArray = debate;

          if (responseText && targetSessionId) {
            // 6. Log the assistant response in database history
            await SessionRepository.addChatMessage(targetSessionId, 'assistant', responseText).catch(err => {
              console.warn('[ChatController] [Database] Failed to log assistant reply:', err.message || err);
            });
          }
        } catch (llmError: any) {
          const providerPrefix = config.LLM_PROVIDER === 'ollama' ? 'Ollama' : 'OpenRouter';
          console.error(`[LLMService] [${providerPrefix}] Request failed:`, llmError.message || llmError);
          throw new Error(`[${providerPrefix}] Request failed: ${llmError.message || llmError}`);
        }
      } else {
        // Fallback: Query LLM directly without saving context / chat history in Postgres
        try {
          const systemInstruction = `You are Aegis, the Multi-Agent Boardroom Growth Copilot.
Instead of responding as a single chatbot, you must simulate a boardroom discussion between 5 distinct growth agents solving the user's strategic question:
1. 👔 CEO Agent (Role: Chief Executive Officer | Responsibility: Initial alignment, direction and final approval | Input: User strategic question | Output: Executive command mandate)
2. 🧭 Strategy Agent (Role: Chief Strategy Architect | Responsibility: Strategic runway calculation & competitive moats | Input: CEO mandate & industry metrics | Output: Growth roadmap blueprint)
3. 📣 Marketing Agent (Role: Chief Marketing Officer | Responsibility: Ad hook copy, content calendar & target channels | Input: Strategy blueprint | Output: 360 Campaign brief)
4. 🎯 Sales Agent (Role: Chief Revenue Officer | Responsibility: Funnel conversions & outbound touch sequence | Input: Marketing campaign mix | Output: Outbound scripts & pipeline protocol)
5. 💹 Finance Agent (Role: Chief Financial Officer | Responsibility: Budget audits, runway check & unit economics board | Input: Sales conversions & CAC targets | Output: Risk audits & feasibility score)

CRITICAL INSTRUCTIONS:
1. CONTEXT INTEGRATION (ALWAYS ENGAGED): You must NEVER speak generically or output generic advice. For any query (including greetings like "hello"), you must speak as the boardroom representing the active company: "${companyName}" (Industry: "${companyIndustry}").
2. Explicitly reference in the conversation:
   - What company you represent: "${companyName}"
   - What you sell / your product/service overview: "${profileDesc}"
   - Who your target customers/audience are: "${targetAudience}"
For example, if the user says "hello", the CEO Agent must welcome the user to the boardroom of "${companyName}", mention that you are scaling in the "${companyIndustry}" space targeting "${targetAudience}", and prompt the board to analyze how to optimize outcomes. The subsequent agents must continue the discussion explicitly citing these metrics and details.
3. DATA-DRIVEN RATING & AUDITING: When asked to rate or audit the business, perform a rigorous, data-driven assessment using the available KPIs, metrics, and agent findings. If certain metrics are N/A or missing, explicitly state which specific data points are absent while assessing the rest, instead of asking the user to re-enter all details.
4. KNOWLEDGE SUMMARIZATION: When asked what you know about the company, summarize the exact company overview, goals, bottlenecks, metrics, and boardroom memories provided below. Do not prompt the user to write their profile again.
5. PROFESSIONAL UNDER-THE-HOOD BEHAVIOR: Never expose internal technical or implementation details (such as PostgreSQL databases, SQL queries, backend APIs, JSON schemas, or "BusinessContext" objects). Keep all operations strictly business-focused.

Format the output strictly as a JSON object of this structure:
{
  "debate": [
    {
      "agent": "...",
      "icon": "...",
      "role": "...",
      "responsibility": "...",
      "input": "...",
      "output": "...",
      "text": "..."
    }
  ]
}`;

          let debate: AgentDebateItem[] = [];
          try {
            const resJson = await LLMService.askJson<DebateResponse>(message, systemInstruction);
            if (resJson && resJson.debate && Array.isArray(resJson.debate)) {
              debate = resJson.debate;
            } else {
              throw new Error('Invalid debate array in JSON response');
            }
          } catch (err) {
            console.warn('[ChatController] Fallback askJson failed:', err);
            const rawText = await LLMService.ask(message, systemInstruction) || '';
            debate = [
              {
                agent: 'CEO Agent',
                icon: '👔',
                role: 'Chief Executive Officer',
                responsibility: 'Sets strategic targets, coordinates boardroom debate, and makes final approvals',
                input: 'User strategic request',
                output: 'Executive boardroom blueprint',
                text: rawText
              }
            ];
          }

          responseText = debate.map(d => `### ${d.icon} ${d.agent} (${d.role})\n**Responsibility**: ${d.responsibility}\n**Input**: ${d.input}\n**Output**: ${d.output}\n\n${d.text}`).join('\n\n---\n\n');
          debateArray = debate;
        } catch (llmError: any) {
          const providerPrefix = config.LLM_PROVIDER === 'ollama' ? 'Ollama' : 'OpenRouter';
          console.error(`[LLMService] [${providerPrefix}] Fallback request failed:`, llmError.message || llmError);
          throw new Error(`[${providerPrefix}] Request failed: ${llmError.message || llmError}`);
        }
      }

      if (!responseText) {
        const providerName = config.LLM_PROVIDER === 'ollama' ? 'local Ollama' : 'OpenRouter';
        responseText = `Aegis copilot is currently unable to generate a response. Please verify that your ${providerName} service is running and properly configured in your environment.`;
      }

      return res.status(200).json({
        message: 'Reply generated successfully',
        response: responseText,
        confidence: 0.9,
        rawJson: { response: responseText, agents: debateArray }
      });
    } catch (error) {
      next(error);
    }
  }
}
