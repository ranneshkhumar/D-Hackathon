import { BusinessContext, AgentResult } from '../types';
import { KnowledgeService } from './knowledge.service';
import { SessionRepository } from '../repositories/session.repository';

// Register all 8 AI Business Growth specialized agents
import { ceoAgent } from '../agents/CEO/agent';
import { financeAgent } from '../agents/Finance/agent';
import { marketingAgent } from '../agents/Marketing/agent';
import { leadAgent } from '../agents/Lead/agent';
import { salesAgent } from '../agents/Sales/agent';
import { strategyAgent } from '../agents/Strategy/agent';
import { analyticsAgent } from '../agents/Analytics/agent';
import { customerSuccessAgent } from '../agents/CustomerSuccess/agent';

const AGENT_REGISTRY: Record<string, any> = {
  CEO: ceoAgent,
  Finance: financeAgent,
  Marketing: marketingAgent,
  Lead: leadAgent,
  Sales: salesAgent,
  Strategy: strategyAgent,
  Analytics: analyticsAgent,
  CustomerSuccess: customerSuccessAgent
};

export class AgentExecutionService {
  /**
   * Coordinates the execution engine workflow:
   * 1. Fetches initial BusinessContext via KnowledgeService.
   * 2. Runs the planned agents sequentially to ease free-tier API rate limits.
   * 3. Rebuilds the context with the fresh AgentMemory.
   * 4. Executes the Strategy Agent to aggregate findings and generate a growth plan.
   * 5. Runs the CEO Agent to summarize findings and strategy details into an Executive Report.
   */
  static async executePlan(organizationId: string, sessionId: string, planAgentNames: string[]): Promise<any> {
    console.log(`[AgentExecutionService] Running plan for session ${sessionId}. Active agents: ${planAgentNames.join(', ')}`);

    // Validate that the provided sessionId exists in the database
    const session = await SessionRepository.findSessionById(sessionId);
    if (!session) {
      throw new Error(`ConversationSession matching ID '${sessionId}' was not found in the database. Cannot execute plan.`);
    }

    // 1. Build initial context
    let context = await KnowledgeService.buildContext(organizationId, sessionId);

    // 2. Execute selected domain agents sequentially to ease API rate limits
    for (const name of planAgentNames) {
      const agent = AGENT_REGISTRY[name];
      if (!agent) {
        console.warn(`[AgentExecutionService] Requested agent '${name}' not found in registry. Skipping.`);
        continue;
      }
      try {
        const result: AgentResult = await agent.analyze(context);
        // Persist findings in AgentMemory database records
        await SessionRepository.upsertAgentMemory(sessionId, name, {
          summary: result.summary,
          issues: result.issues,
          recommendations: result.recommendations,
          confidence: result.confidence,
          rawJson: result.rawJson
        });
        
        console.log(`[AgentExecutionService] Executed agent '${name}' successfully. Cooling down for 1500ms...`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (err) {
        console.error(`[AgentExecutionService] Execution failed for agent '${name}':`, err);
      }
    }

    // 3. Rebuild context to incorporate fresh AgentMemory inputs
    context = await KnowledgeService.buildContext(organizationId, sessionId);

    // 4. Execute the Strategy Agent to build the primary Growth Strategy
    const strategyResult = await strategyAgent.analyze(context);
    await SessionRepository.saveAIAnalysis(organizationId, 'STRATEGY', strategyResult.rawJson);

    // Add brief delay before CEO summary call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 5. Execute the CEO Agent to compile strategy findings and summary metrics
    const ceoResult = await ceoAgent.analyze(context, { strategy: strategyResult.rawJson });
    await SessionRepository.saveAIAnalysis(organizationId, 'EXEC_SUMMARY', ceoResult.rawJson);

    return {
      success: true,
      findings: context.agentMemory,
      strategy: strategyResult.rawJson,
      executiveReport: ceoResult.rawJson
    };
  }
}
