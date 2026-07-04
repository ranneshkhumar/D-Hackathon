import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { SessionRepository } from '../repositories/session.repository';

export class DiscoveryController {
  /**
   * Initializes a conversational discovery session for onboarding.
   */
  static async start(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.body;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required to start onboarding' });
      }

      const session = await SessionRepository.createSession(organizationId, 'Business Onboarding Discovery');
      
      // Save initial assistant greeting
      const greeting = 'Welcome! I am the CEO Agent. Let us configure your workspace. To start, tell me about your business. What is your core product or service?';
      await SessionRepository.addChatMessage(session.id, 'assistant', greeting);

      return res.status(200).json({
        message: 'Onboarding discovery session initialized successfully',
        sessionId: session.id,
        nextQuestion: greeting
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Receives user reply, extracts profile data, updates the database, and returns the next follow-up.
   */
  static async message(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ error: 'Session ID and message body are required' });
      }

      // Log user message
      await SessionRepository.addChatMessage(sessionId, 'user', message);

      // Conversational discovery placeholder loops
      const followUp = 'Thank you. Next, who are your primary competitors, and what are the main operational challenges you face today?';
      await SessionRepository.addChatMessage(sessionId, 'assistant', followUp);

      return res.status(200).json({
        message: 'Message processed',
        nextQuestion: followUp,
        discoveryComplete: false
      });
    } catch (error) {
      next(error);
    }
  }
}
