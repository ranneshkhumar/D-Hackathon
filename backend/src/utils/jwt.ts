import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JwtPayload): string {
  // Signs standard JSON Web Token valid for 7 days
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload {
  // Throws error if token is invalid or expired
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
}
