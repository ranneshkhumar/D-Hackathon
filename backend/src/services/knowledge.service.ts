import { OrgRepository } from '../repositories/org.repository';
import { SessionRepository } from '../repositories/session.repository';
import { BusinessContext, AgentResult } from '../types';

export class KnowledgeService {
  /**
   * Aggregates multi-tenant workspace records and generates a consolidated, immutable context
   * object. Individual specializations (agents) consume this data block.
   */
  static async buildContext(organizationId: string, sessionId?: string): Promise<BusinessContext> {
    console.log(`[KnowledgeService] Building BusinessContext for Organization: ${organizationId}`);

    // Retrieve organization data
    const org = await OrgRepository.findById(organizationId);
    if (!org) {
      throw new Error(`Organization matching ID '${organizationId}' was not found`);
    }

    // Retrieve metrics and historical reports
    const metrics = await OrgRepository.getMetrics(organizationId);
    const analyses = await SessionRepository.getAIAnalyses(organizationId);

    // Retrieve chat history and intermediate memories
    let chats: any[] = [];
    const agentMemory: Record<string, AgentResult> = {};

    if (sessionId) {
      const session = await SessionRepository.findSessionById(sessionId);
      if (session) {
        chats = session.chats;

        // Group individual agent memory records by AgentName
        for (const mem of session.agentMemories) {
          agentMemory[mem.agentName] = {
            agentName: mem.agentName,
            summary: mem.summary,
            issues: Array.isArray(mem.issues) ? (mem.issues as string[]) : [],
            recommendations: Array.isArray(mem.recommendations) ? (mem.recommendations as string[]) : [],
            confidence: mem.confidence,
            rawJson: (mem.rawJson as Record<string, any>) || {}
          };
        }
      }
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
      profile: org.businessProfile ? (org.businessProfile.profileData as any) : null,
      metrics: metrics.map(m => ({
        metricName: m.metricName,
        value: m.value,
        period: m.period,
        timestamp: m.timestamp
      })),
      previousAnalyses: analyses.map(a => ({
        analysisType: a.analysisType,
        results: a.results,
        createdAt: a.createdAt
      })),
      chatHistory: chats.map(c => ({
        role: c.role as 'user' | 'assistant',
        content: c.content,
        createdAt: c.createdAt
      })),
      agentMemory
    };
  }
}
