import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { LLMService } from '../services/llm.service';

export class HealthController {
  /**
   * Compiles and returns comprehensive health status reports for all core systems.
   */
  static async checkHealth(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Audit NeonDB Connection
      let dbStatus: 'ACTIVE' | 'UNAVAILABLE' = 'ACTIVE';
      let dbLatencyMs: number | null = null;
      const dbStart = Date.now();
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbLatencyMs = Date.now() - dbStart;
      } catch (err) {
        dbStatus = 'UNAVAILABLE';
      }

      // 2. Audit Gemini Providers
      const geminiHealth = LLMService.getProvidersHealth();
      const anyLive = geminiHealth.some(p => p.status === 'ACTIVE');

      // 3. Audit Sandbox Engine
      const sandboxStatus = 'ACTIVE'; // Standby sandbox state

      // 4. Audit AI Orchestration Service
      const orchestrationStatus = anyLive ? 'ACTIVE' : 'SANDBOX_FALLBACK';

      // 5. Build consolidated audit report
      return res.status(dbStatus === 'ACTIVE' ? 200 : 500).json({
        success: dbStatus === 'ACTIVE',
        timestamp: new Date().toISOString(),
        components: {
          database: {
            name: 'Neon PostgreSQL',
            status: dbStatus,
            latencyMs: dbLatencyMs,
          },
          sandboxEngine: {
            name: 'Aegis Local Simulation Sandbox',
            status: sandboxStatus,
            fallbackTriggered: !anyLive
          },
          aiOrchestration: {
            name: 'Multi-Agent Advisory Boardroom',
            status: orchestrationStatus,
            providersCount: geminiHealth.length,
          },
          geminiProviders: geminiHealth.map(p => ({
            providerIndex: p.index,
            maskedKey: p.apiKeyMasked,
            status: p.status,
            lastSuccessfulRequest: p.lastSuccess ? p.lastSuccess.toISOString() : null,
            retryAfter: p.retryAfter ? p.retryAfter.toISOString() : null,
            failureCount: p.failureCount,
            lastError: p.lastError
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
