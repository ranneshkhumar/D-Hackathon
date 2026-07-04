import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { AgentExecutionService } from '../services/agent-execution.service';

export class StrategyController {
  /**
   * Triggers agent execution to formulate a growth strategy.
   */
  static async generate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId, sessionId } = req.body;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required to generate strategy' });
      }

      const { prisma } = require('../config/db');
      let org = await prisma.organization.findUnique({ where: { id: organizationId } });
      if (!org) {
        org = await prisma.organization.create({
          data: {
            id: organizationId,
            name: 'Aegis Dynamic Workspace',
            industry: 'Technology',
            kpiMetrics: {
              create: {}
            }
          }
        });
      }

      const { SessionRepository } = require('../repositories/session.repository');
      let targetSessionId = sessionId;
      if (!targetSessionId) {
        const sessions = await SessionRepository.listSessions(organizationId);
        if (sessions.length > 0) {
          targetSessionId = sessions[0].id;
        } else {
          const newSession = await SessionRepository.createSession(organizationId, 'Growth Workspace');
          targetSessionId = newSession.id;
        }
      }

      const plan = ['Finance', 'Marketing', 'Sales', 'CustomerSuccess'];
      const result = await AgentExecutionService.executePlan(organizationId, targetSessionId, plan);

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

  /**
   * Fetches the latest computed strategy runs and domain agent memories from the database.
   */
  static async getLatest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const organizationId = req.query.organizationId as string;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required' });
      }

      const { SessionRepository } = require('../repositories/session.repository');
      const sessions = await SessionRepository.listSessions(organizationId);
      if (sessions.length === 0) {
        return res.status(200).json({ success: false, message: 'No active session found' });
      }

      const sessionId = sessions[0].id;
      const { KnowledgeService } = require('../services/knowledge.service');
      const context = await KnowledgeService.buildContext(organizationId, sessionId);

      const { prisma } = require('../config/db');
      const latestStrategy = await prisma.aIAnalysis.findFirst({
        where: { organizationId, analysisType: 'STRATEGY' },
        orderBy: { createdAt: 'desc' }
      });
      const latestCEO = await prisma.aIAnalysis.findFirst({
        where: { organizationId, analysisType: 'CEO_SUMMARY' },
        orderBy: { createdAt: 'desc' }
      });

      let strategy = null;
      let executiveReport = null;
      
      try {
        if (latestStrategy?.results) strategy = JSON.parse(latestStrategy.results);
      } catch(e) {}
      try {
        if (latestCEO?.results) executiveReport = JSON.parse(latestCEO.results);
      } catch(e) {}

      if (!strategy || !executiveReport) {
        return res.status(200).json({ success: false, message: 'No completed strategy runs found' });
      }

      return res.status(200).json({
        success: true,
        findings: context.agentMemory,
        strategy,
        executiveReport
      });
    } catch (error) {
      next(error);
    }
  }
}
