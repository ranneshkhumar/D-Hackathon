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
      const { organizationId, sessionId, message } = req.body;

      if (!organizationId || !message) {
        return res.status(400).json({ error: 'Organization ID and message body are required' });
      }

      let responseText: string | null = null;
      let targetSessionId = sessionId;
      let context: any = null;
      let historySummary = '';
      let agentMemoriesSummary = '';
      let metricsSummary = '';
      let profileDesc = 'Not specified';
      let profileGoals = 'Not specified';
      let profileChallenges = 'Not specified';
      let useFallbackChat = false;

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

        profileDesc = context.profile?.businessDescription || context.profile?.description || 'Not specified';
        
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

      if (!useFallbackChat) {
        try {
          const targetAudience = context.profile?.targetAudience || 'Not specified';
          const competitors = context.profile?.competitors || 'Not specified';
          const businessModel = context.profile?.businessModel || 'Not specified';

          // 4. Construct instruction and prompt templates
          const systemInstruction = `You are Aegis, the Executive Business Advisor and Master AI Growth Copilot.
You act as a permanent, persistent boardroom orchestrator. Every recommendation and audit response you generate must be rooted in the real-time business context provided below.

CRITICAL INSTRUCTIONS:
1. PERSISTENCE & CONTEXT-AWARENESS: You must never state that you have "no prior knowledge" or that you need the user to re-provide their business profile/details if data already exists in the context.
2. DATA-DRIVEN RATING & AUDITING: When asked to rate or audit the business, perform a rigorous, data-driven assessment using the available KPIs, metrics, and agent findings. If certain metrics are N/A or missing, explicitly state which specific data points are absent (e.g., "We currently lack website visitors logs...") while assessing the rest, instead of asking the user to re-enter all details.
3. KNOWLEDGE SUMMARIZATION: When asked what you know about the company, summarize the exact company overview, goals, bottlenecks, metrics, and boardroom memories provided below. Do not prompt the user to write their profile again.
4. PROFESSIONAL UNDER-THE-HOOD BEHAVIOR: Never expose internal technical or implementation details (such as PostgreSQL databases, SQL queries, backend APIs, JSON schemas, or "BusinessContext" objects). Keep all operations strictly business-focused.

You have access to the following live company information:
- Company Name: ${context.organization.name} (Industry: ${context.organization.industry})
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

Respond professionally, authoritatively, and with strategic precision. Reference the numbers in the context when formulating recommendations.`;

          const prompt = `Conversation History:
${historySummary}

User Question: ${message}`;

          // 5. Generate response using load balanced LLMService
          responseText = await LLMService.ask(prompt, systemInstruction);

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
          const systemInstruction = `You are Aegis, the Executive Business Advisor and Master AI Growth Copilot.
Your goal is to assist the executive team with high-impact strategic advisory and growth recommendations.
Provide professional, authoritative, and strategic recommendations in Markdown.
Never expose internal technical or implementation details (such as PostgreSQL, database tables, SQL queries, backend APIs, or "BusinessContext" objects).`;

          responseText = await LLMService.ask(message, systemInstruction);
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
        rawJson: { response: responseText }
      });
    } catch (error) {
      next(error);
    }
  }
}
