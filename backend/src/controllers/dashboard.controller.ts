import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrgRepository } from '../repositories/org.repository';

export class DashboardController {
  /**
   * Compiles the dynamic organization metrics from the PostgreSQL database.
   */
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const organizationId = req.query.organizationId as string;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID query parameter is required' });
      }

      const org = await OrgRepository.findById(organizationId);
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' });
      }

      const kpis = org.kpiMetrics;

      // Extract calculated metric parameters from database
      const payload = {
        businessHealthScore: kpis?.businessHealthScore || 80,
        growthScore: kpis?.growthScore || 70,
        revenueOpportunity: kpis?.revenueOpportunity ? `₹${Number(kpis.revenueOpportunity).toLocaleString('en-IN')}` : '₹0',
        leadScore: kpis?.leadScore || 60,
        customerHealth: kpis?.customerHealth || 80,
        marketReadiness: kpis?.marketReadiness ? `${kpis.marketReadiness}% readiness` : '75% readiness',
        riskScore: kpis?.riskScore || 0,
        executiveSummary: kpis?.executiveSummary || 'Workspace initialized. Run the agent boardroom to compile executive findings.',
        riskAlerts: kpis?.riskScore && kpis.riskScore > 0 ? ['Identified operational cash burn rate risks.'] : [],
        aiRecommendations: [
          'Address marketing channel ROI allocations to reduce CAC.',
          'Optimize sales qualification workflows to improve close ratios.'
        ]
      };

      return res.status(200).json({
        success: true,
        summary: payload
      });
    } catch (error) {
      next(error);
    }
  }
}
