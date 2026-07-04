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
    return prisma.agentMemory.upsert({
      where: {
        sessionId_agentName: { sessionId, agentName }
      },
      update: {
        summary: data.summary,
        issues: data.issues,
        recommendations: data.recommendations,
        confidence: data.confidence,
        rawJson: data.rawJson
      },
      create: {
        sessionId,
        agentName,
        summary: data.summary,
        issues: data.issues,
        recommendations: data.recommendations,
        confidence: data.confidence,
        rawJson: data.rawJson
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
      data: { organizationId, analysisType, results }
    });
  }

  static async getAIAnalyses(organizationId: string): Promise<AIAnalysis[]> {
    return prisma.aIAnalysis.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
