import { Request, Response, NextFunction } from 'express';
import { signToken } from '../utils/jwt';

export class AuthController {
  /**
   * Mock registration endpoint bypassing UserRepository.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;
      const mockId = 'mock-user-id';
      const token = signToken({ userId: mockId, email });

      return res.status(201).json({
        message: 'Account created successfully (Mock Bypass)',
        token,
        user: { id: mockId, email, name: name || 'Admin User' }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mock login endpoint bypassing UserRepository.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const mockId = 'mock-user-id';
      const token = signToken({ userId: mockId, email });

      return res.status(200).json({
        message: 'Login successful (Mock Bypass)',
        token,
        user: { id: mockId, email, name: 'Admin User' }
      });
    } catch (error) {
      next(error);
    }
  }
}
