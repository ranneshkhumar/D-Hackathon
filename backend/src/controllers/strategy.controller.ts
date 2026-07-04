import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AgentExecutionService } from '../services/agent-execution.service';

export class StrategyController {
  /**
   * Triggers agent execution to formulate a growth strategy.
   * Runs Finance, Marketing, Sales, and CustomerSuccess agents, compiles outcomes via
   * the Strategy Agent, and summarizes them using the CEO Agent.
   */
  static async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId, sessionId } = req.body;

      if (!organizationId || !sessionId) {
        return res.status(400).json({ error: 'Organization ID and Session ID are required to generate strategy' });
      }

      // Execute plans for standard growth audit: run Finance, Marketing, Sales, and CustomerSuccess agents
      const plan = ['Finance', 'Marketing', 'Sales', 'CustomerSuccess'];
      const result = await AgentExecutionService.executePlan(organizationId, sessionId, plan);

      return res.status(200).json({
        message: 'Growth strategy generated successfully',
        findings: result.findings,
        strategy: result.strategy,
        executiveReport: result.executiveReport
      });
    } catch (error) {
      next(error);
    }
  }
}
