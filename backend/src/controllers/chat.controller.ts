import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SessionRepository } from '../repositories/session.repository';
import { KnowledgeService } from '../services/knowledge.service';
import { ceoAgent } from '../agents/CEO/agent';

export class ChatController {
  /**
   * Processes user messages, builds the consolidated business context, queries the CEO Agent,
   * saves dialogue logs in history, and returns the executive assistant's reply.
   */
  static async message(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId, sessionId, message } = req.body;

      if (!organizationId || !sessionId || !message) {
        return res.status(400).json({ error: 'Organization ID, Session ID, and message body are required' });
      }

      // 1. Log the user prompt
      await SessionRepository.addChatMessage(sessionId, 'user', message);

      // 2. Fetch the central BusinessContext (encapsulated records compile)
      const context = await KnowledgeService.buildContext(organizationId, sessionId);

      // 3. Process with CEO Agent
      const agentResult = await ceoAgent.analyze(context);

      // 4. Log the assistant response in database history
      const responseText = agentResult.summary;
      await SessionRepository.addChatMessage(sessionId, 'assistant', responseText);

      return res.status(200).json({
        message: 'Reply generated successfully',
        response: responseText,
        confidence: agentResult.confidence,
        rawJson: agentResult.rawJson
      });
    } catch (error) {
      next(error);
    }
  }
}
