import { OrgRepository } from '../repositories/org.repository';
import { SessionRepository } from '../repositories/session.repository';
import { BusinessContext, AgentResult } from '../types';
import { BusinessContextService } from './business-context.service';

export class KnowledgeService {
  /**
   * Aggregates multi-tenant workspace records and generates a consolidated context object.
   * Leverages BusinessContextService as the backend single source of truth.
   */
  static async buildContext(organizationId: string, sessionId?: string): Promise<BusinessContext> {
    console.log(`[KnowledgeService] Building BusinessContext for Organization: ${organizationId}`);

    const org = await OrgRepository.findById(organizationId);
    if (!org) {
      throw new Error(`Organization matching ID '${organizationId}' was not found`);
    }

    const aggregated = await BusinessContextService.buildContext(organizationId);
    const analyses = await SessionRepository.getAIAnalyses(organizationId);

    let chats: any[] = [];
    const agentMemory: Record<string, AgentResult> = {};

    if (sessionId) {
      const session = await SessionRepository.findSessionById(sessionId);
      if (session) {
        chats = session.chats;

        for (const mem of session.agentMemories) {
          let parsedIssues: string[] = [];
          let parsedRecs: string[] = [];
          let parsedRaw: any = {};
          
          try {
            parsedIssues = mem.issues ? JSON.parse(mem.issues) : [];
          } catch(e) {}
          try {
            parsedRecs = mem.recommendations ? JSON.parse(mem.recommendations) : [];
          } catch(e) {}
          try {
            parsedRaw = mem.rawJson ? JSON.parse(mem.rawJson) : {};
          } catch(e) {}

          agentMemory[mem.agentName] = {
            agentName: mem.agentName,
            summary: mem.summary,
            issues: parsedIssues,
            recommendations: parsedRecs,
            confidence: mem.confidence,
            rawJson: parsedRaw
          };
        }
      }
    }

    // Format metrics into a compatible array for metrics loops
    const metrics: any[] = [];
    if (aggregated.financialMetrics.monthlyRevenue !== null) {
      metrics.push({
        metricName: 'revenue',
        value: aggregated.financialMetrics.monthlyRevenue,
        period: 'monthly',
        timestamp: new Date()
      });
    }

    return {
      organization: {
        id: org.id,
        name: org.name,
        website: org.website,
        industry: org.industry,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt
      },
      profile: {
        ...aggregated.profile,
        goals: aggregated.goals,
        challenges: aggregated.challenges,
        kpis: aggregated.kpis,
        rawContext: aggregated // Unified context for advanced agent lookups
      },
      metrics,
      previousAnalyses: analyses.map(a => {
        let parsedResults = {};
        try {
          parsedResults = a.results ? JSON.parse(a.results) : {};
        } catch(e) {}
        return {
          analysisType: a.analysisType,
          results: parsedResults,
          createdAt: a.createdAt
        };
      }),
      chatHistory: chats.map(c => ({
        role: c.role as 'user' | 'assistant',
        content: c.content,
        createdAt: c.createdAt
      })),
      agentMemory
    };
  }
}
