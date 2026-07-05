import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrgRepository } from '../repositories/org.repository';
import { KpiCalculationService } from '../services/kpi-calculation.service';

export class OrgController {
  /**
   * Creates a new organization workspace.
   */
  static async createOrg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, industry, website } = req.body;
      const org = await OrgRepository.create(name, industry, website);

      return res.status(201).json({
        message: 'Organization workspace created successfully',
        organization: org
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves organization profile variables.
   */
  static async getOrg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const org = await OrgRepository.findById(id);

      if (!org) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      return res.status(200).json({
        organization: org
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates organization description and details.
   */
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { profileData } = req.body;

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

      const date = timestamp ? new Date(timestamp) : new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      let metric: any = null;
      const parsedVal = Number(value);

      if (metricName === 'revenue') {
        metric = await OrgRepository.upsertFinancialMetrics(id, month, year, {
          monthlyRevenue: parsedVal,
          metricSource: 'manual'
        });
      } else if (metricName === 'expenses') {
        metric = await OrgRepository.upsertFinancialMetrics(id, month, year, {
          monthlyExpenses: parsedVal,
          metricSource: 'manual'
        });
      } else {
        metric = { success: true, metricName, value: parsedVal };
      }

      // Automatically recalculate KPIs after manual metric uploads
      await KpiCalculationService.calculateKPIs(id);

      return res.status(201).json({
        message: 'Normalized business metric logged successfully',
        metric
      });
    } catch (error) {
      next(error);
    }
  }
}
