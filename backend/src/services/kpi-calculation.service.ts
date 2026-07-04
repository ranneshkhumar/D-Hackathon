import { prisma } from '../config/db';
import { OrgRepository } from '../repositories/org.repository';

export class KpiCalculationService {
  /**
   * Recalculates and persists all KPIs and Risk Alerts for an organization.
   */
  static async calculateKPIs(organizationId: string): Promise<any> {
    // 1. Fetch all historical metric logs
    const org = await OrgRepository.findById(organizationId);
    if (!org) {
      throw new Error(`Organization ${organizationId} not found`);
    }

    // Use latest monthly records
    const financial = org.financialMetrics[0] || null;
    const sales = org.salesMetrics[0] || null;
    const marketing = org.marketingMetrics[0] || null;
    const customer = org.customerMetrics[0] || null;

    // Convert Decimals to standard numbers
    const revenue = financial?.monthlyRevenue ? Number(financial.monthlyRevenue) : 0;
    const expenses = financial?.monthlyExpenses ? Number(financial.monthlyExpenses) : 0;
    const grossMargin = financial?.profitMargin ? Number(financial.profitMargin) : 30; // fallback
    const marketingSpend = marketing?.monthlyMarketingSpend ? Number(marketing.monthlyMarketingSpend) : 0;
    const conversionRate = sales?.conversionRate ? Number(sales.conversionRate) : 15; // fallback
    const csat = customer?.customerSatisfaction ? Number(customer.customerSatisfaction) : 80; // fallback
    const retentionRate = customer?.retentionRate ? Number(customer.retentionRate) : 85; // fallback
    const churnRate = customer?.churnRate ? Number(customer.churnRate) : 5; // fallback
    const nps = customer?.nps ? Number(customer.nps) : 35; // fallback
    const supportTickets = customer?.supportTickets ? Number(customer.supportTickets) : 0;

    // 2. Formulate dynamic calculations
    // Business Health: Margin, CSAT, and Retention weighted contributions
    const netProfitMargin = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0;
    const healthContrib1 = Math.max(0, Math.min(100, netProfitMargin)) * 0.4;
    const healthContrib2 = csat * 0.3;
    const healthContrib3 = retentionRate * 0.3;
    const businessHealthScore = Math.round(healthContrib1 + healthContrib2 + healthContrib3);

    // Growth Score: Marketing spends efficacy, Conversion ratios, and NPS weights
    const mktRatio = revenue > 0 ? (marketingSpend / revenue) * 100 : 0;
    const growthContrib1 = Math.min(100, mktRatio * 4) * 0.3; // ideal ratio around 10-15%
    const growthContrib2 = conversionRate * 2.5 * 0.4; // ideal conversion around 15-20%
    const growthContrib3 = Math.max(0, Math.min(100, (nps + 10) * 1.25)) * 0.3;
    const growthScore = Math.round(growthContrib1 + growthContrib2 + growthContrib3);

    // Revenue Opportunity: Potential uplift from optimizing lost conversions
    const lostRev = revenue * (1 - conversionRate / 100);
    const revenueOpportunity = Math.round(lostRev * 0.15); // assume we can reclaim 15% of lost conversions

    // Lead Score: Quality of incoming prospects
    const leads = sales?.monthlyLeads ? Number(sales.monthlyLeads) : 0;
    const qLeads = sales?.qualifiedLeads ? Number(sales.qualifiedLeads) : 0;
    const leadScore = leads > 0 ? Math.round((qLeads / leads) * 100) : 60;

    // Customer Health
    const customerHealth = Math.round((retentionRate * 0.6) + (csat * 0.4));

    // Market Readiness
    const marketReadiness = Math.round(Math.min(100, 60 + (grossMargin - 20) * 0.8 + (nps * 0.2)));

    // Risk Score: high expenses vs revenue, high churn, high tickets
    let riskScore = 0;
    const riskAlerts: string[] = [];

    if (expenses > revenue) {
      riskScore += 40;
      riskAlerts.push(`Burn Deficit: Monthly expenses exceed revenue by ₹${expenses - revenue}`);
    }
    if (churnRate > 12) {
      riskScore += 30;
      riskAlerts.push(`High Churn Alert: Customer churn is at ${churnRate}%, exceeding safety threshold of 10%`);
    }
    if (grossMargin < 20) {
      riskScore += 20;
      riskAlerts.push(`Thin Margin Alert: Gross margin is critically thin at ${grossMargin}%`);
    }
    if (supportTickets > 50) {
      riskScore += 10;
      riskAlerts.push(`CS Workload: High volumes of unresolved support tickets (${supportTickets}) detected`);
    }

    riskScore = Math.min(100, riskScore);

    // 3. Draft the Executive Summary
    let executiveSummary = `Aegis completed a financial growth audit for ${org.name}. `;
    if (riskScore > 50) {
      executiveSummary += `Operational risks require immediate boardroom attention: ${riskAlerts[0] || 'expenses exceed revenue'}. `;
    } else {
      executiveSummary += `All operational indexes are tracking within nominal bounds, with strong Gross Margins of ${grossMargin}%. `;
    }
    executiveSummary += `Focusing on optimizing conversion rates by 5% represents a ₹${revenueOpportunity} increase in incremental monthly profits.`;

    // 4. Save and return KpiRecord
    return OrgRepository.upsertKPIMetrics(organizationId, {
      businessHealthScore,
      growthScore,
      revenueOpportunity,
      leadScore,
      customerHealth,
      marketReadiness,
      riskScore,
      executiveSummary
    });
  }
}
