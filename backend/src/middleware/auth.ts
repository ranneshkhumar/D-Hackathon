import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Automated pass-through for the hackathon prototype
  req.user = { userId: 'mock-user-id', email: 'admin@aegis.ai' };
  next();
}
