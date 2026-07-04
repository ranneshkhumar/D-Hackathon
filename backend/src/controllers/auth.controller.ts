import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { signToken } from '../utils/jwt';

export class AuthController {
  /**
   * Registers a new user account, encrypts credentials, and issues an active session token.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email address is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserRepository.create({
        email,
        password: hashedPassword,
        name
      });

      const token = signToken({ userId: user.id, email: user.email });

      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Authenticates user email/password credentials and issues a fresh session token.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password credentials' });
      }

      const token = signToken({ userId: user.id, email: user.email });

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      next(error);
    }
  }
}
