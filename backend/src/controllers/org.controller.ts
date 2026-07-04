import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrgRepository } from '../repositories/org.repository';
import { Role } from '@prisma/client';

export class OrgController {
  /**
   * Creates a new organization workspace and links the creating user as the OWNER.
   */
  static async createOrg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, industry, website } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized user context' });
      }

      const org = await OrgRepository.create(name, industry, website || undefined);
      // Bind creating user as the OWNER of the tenant workspace
      await OrgRepository.addMember(org.id, userId, Role.OWNER);

      return res.status(201).json({
        message: 'Organization workspace initialized successfully',
        organization: org
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves organization details including the dynamic business profile and metrics.
   */
  static async getOrg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const org = await OrgRepository.findById(id);

      if (!org) {
        return res.status(404).json({ error: 'Organization workspace not found' });
      }

      return res.status(200).json(org);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates or inserts a flexible business profile structure.
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const profileData = req.body;

      const profile = await OrgRepository.upsertProfile(id, profileData);

      return res.status(200).json({
        message: 'Business profile updated successfully',
        profile
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logs a new normalized time-series business metric.
   */
  static async addMetric(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { metricName, value, period, timestamp } = req.body;

      const metric = await OrgRepository.addMetric(id, metricName, value, period, timestamp);

      return res.status(201).json({
        message: 'Normalized business metric logged successfully',
        metric
      });
    } catch (error) {
      next(error);
    }
  }
}
