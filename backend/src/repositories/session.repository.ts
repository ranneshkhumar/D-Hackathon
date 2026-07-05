import { prisma } from '../config/db';
import { ConversationSession, ChatHistory, AgentMemory, AIAnalysis } from '@prisma/client';

export class SessionRepository {
  static async createSession(organizationId: string, title: string): Promise<ConversationSession> {
    return prisma.conversationSession.create({
      data: { organizationId, title }
    });
  }

  static async findSessionById(id: string) {
    return prisma.conversationSession.findUnique({
      where: { id },
      include: {
        chats: { orderBy: { createdAt: 'asc' } },
        agentMemories: true
      }
    });
  }

  static async listSessions(organizationId: string): Promise<ConversationSession[]> {
    return prisma.conversationSession.findMany({
      where: { organizationId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async addChatMessage(sessionId: string, role: string, content: string): Promise<ChatHistory> {
    const session = await prisma.conversationSession.findUnique({
      where: { id: sessionId }
    });
    if (!session) {
      throw new Error(`ConversationSession matching ID '${sessionId}' was not found. Cannot add chat message.`);
    }

    const chat = await prisma.chatHistory.create({
      data: { sessionId, role, content }
    });
    // Touch session updatedAt to indicate activity
    await prisma.conversationSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });
    return chat;
  }

  static async upsertAgentMemory(sessionId: string, agentName: string, data: {
    summary: string;
    issues: string[];
    recommendations: string[];
    confidence: number;
    rawJson: any;
  }): Promise<AgentMemory> {
    const session = await prisma.conversationSession.findUnique({
      where: { id: sessionId }
    });
    if (!session) {
      throw new Error(`ConversationSession matching ID '${sessionId}' was not found. Cannot upsert AgentMemory.`);
    }

    const serializedIssues = JSON.stringify(data.issues);
    const serializedRecommendations = JSON.stringify(data.recommendations);
    const serializedRawJson = JSON.stringify(data.rawJson);

    return prisma.agentMemory.upsert({
      where: {
        sessionId_agentName: { sessionId, agentName }
      },
      update: {
        summary: data.summary,
        issues: serializedIssues,
        recommendations: serializedRecommendations,
        confidence: data.confidence,
        rawJson: serializedRawJson
      },
      create: {
        sessionId,
        agentName,
        summary: data.summary,
        issues: serializedIssues,
        recommendations: serializedRecommendations,
        confidence: data.confidence,
        rawJson: serializedRawJson
      }
    });
  }

  static async getAgentMemories(sessionId: string): Promise<AgentMemory[]> {
    return prisma.agentMemory.findMany({
      where: { sessionId }
    });
  }

  static async saveAIAnalysis(organizationId: string, analysisType: string, results: any): Promise<AIAnalysis> {
    return prisma.aIAnalysis.create({
      data: { 
        organizationId, 
        analysisType, 
        results: JSON.stringify(results) 
      }
    });
  }

  static async getAIAnalyses(organizationId: string): Promise<AIAnalysis[]> {
    return prisma.aIAnalysis.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
