import { prisma } from '../config/db';
import { 
  Organization, 
  BusinessProfile, 
  BusinessGoal, 
  BusinessChallenge, 
  FinancialMetrics, 
  SalesMetrics, 
  MarketingMetrics, 
  CustomerMetrics, 
  KPIMetrics 
} from '@prisma/client';

export class OrgRepository {
  /**
   * Creates a new organization workspace
   */
  static async create(name: string, industry: string, website?: string): Promise<Organization> {
    return prisma.organization.create({
      data: { 
        name, 
        industry, 
        website,
        kpiMetrics: {
          create: {} // Create empty KPI metrics record for this organization
        }
      }
    });
  }

  /**
   * Mock member additions for prototype compatibility
   */
  static async addMember(organizationId: string, userId: string, role: string): Promise<any> {
    return { success: true, organizationId, userId, role };
  }

  /**
   * Finds an organization by ID with all related profiles
   */
  static async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        businessProfile: true,
        businessGoals: true,
        businessChallenges: true,
        financialMetrics: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
        salesMetrics: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
        marketingMetrics: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
        customerMetrics: { orderBy: [{ year: 'desc' }, { month: 'desc' }] },
        kpiMetrics: true,
        uploadedFiles: true,
        importHistories: true
      }
    });
  }

  /**
   * Returns all organizations (Prototype bypass for user-specific loading)
   */
  static async findByUserId(userId: string): Promise<Organization[]> {
    return prisma.organization.findMany();
  }

  /**
   * Deletes an organization and all cascading records
   */
  static async delete(id: string): Promise<Organization> {
    return prisma.organization.delete({
      where: { id }
    });
  }

  /**
   * Upserts the business profile details
   */
  static async upsertBusinessProfile(
    organizationId: string, 
    data: {
      businessDescription?: string | null;
      businessModel?: string | null;
      products?: string | null;
      services?: string | null;
      targetAudience?: string | null;
      competitors?: string | null;
      vision?: string | null;
      mission?: string | null;
    }
  ): Promise<BusinessProfile> {
    return prisma.businessProfile.upsert({
      where: { organizationId },
      update: data,
      create: { organizationId, ...data }
    });
  }

  /**
   * Refactors the old profile upsert to map onto the new columns
   */
  static async upsertProfile(organizationId: string, profileData: any): Promise<BusinessProfile> {
    return this.upsertBusinessProfile(organizationId, {
      businessDescription: profileData.businessDescription || profileData.doc_text || '',
      businessModel: profileData.businessType || '',
      products: profileData.primaryProduct || '',
      services: profileData.services || '',
      targetAudience: profileData.targetAudience || '',
      competitors: profileData.competitors || '',
      vision: profileData.vision || '',
      mission: profileData.mission || ''
    });
  }

  /**
   * Adds a goal to the organization list
   */
  static async addBusinessGoal(organizationId: string, goal: {
    goalType: string;
    description: string;
    targetValue?: string | null;
    deadline?: Date | null;
    priority?: string | null;
    status?: string | null;
  }): Promise<BusinessGoal> {
    return prisma.businessGoal.create({
      data: { organizationId, ...goal }
    });
  }

  /**
   * Clears goals for fresh CSV ingestion sync
   */
  static async clearBusinessGoals(organizationId: string) {
    return prisma.businessGoal.deleteMany({
      where: { organizationId }
    });
  }

  /**
   * Adds a challenge to the organization list
   */
  static async addBusinessChallenge(organizationId: string, challenge: {
    category?: string | null;
    description: string;
    severity?: string | null;
    status?: string | null;
  }): Promise<BusinessChallenge> {
    return prisma.businessChallenge.create({
      data: { organizationId, ...challenge }
    });
  }

  /**
   * Clears challenges for fresh CSV ingestion sync
   */
  static async clearBusinessChallenges(organizationId: string) {
    return prisma.businessChallenge.deleteMany({
      where: { organizationId }
    });
  }

  /**
   * Upserts monthly financial indicators
   */
  static async upsertFinancialMetrics(
    organizationId: string,
    month: number,
    year: number,
    data: {
      monthlyRevenue?: number | null;
      monthlyExpenses?: number | null;
      grossProfit?: number | null;
      netProfit?: number | null;
      profitMargin?: number | null;
      cashFlow?: number | null;
      burnRate?: number | null;
      customerAcquisitionCost?: number | null;
      customerLifetimeValue?: number | null;
      averageOrderValue?: number | null;
      metricSource?: string;
    }
  ): Promise<FinancialMetrics> {
    const record = {
      monthlyRevenue: data.monthlyRevenue ?? null,
      monthlyExpenses: data.monthlyExpenses ?? null,
      grossProfit: data.grossProfit ?? null,
      netProfit: data.netProfit ?? null,
      profitMargin: data.profitMargin ?? null,
      cashFlow: data.cashFlow ?? null,
      burnRate: data.burnRate ?? null,
      customerAcquisitionCost: data.customerAcquisitionCost ?? null,
      customerLifetimeValue: data.customerLifetimeValue ?? null,
      averageOrderValue: data.averageOrderValue ?? null,
      metricSource: data.metricSource || 'manual'
    };

    return prisma.financialMetrics.upsert({
      where: {
        organizationId_month_year: { organizationId, month, year }
      },
      update: record,
      create: { organizationId, month, year, ...record }
    });
  }

  /**
   * Upserts monthly sales indicators
   */
  static async upsertSalesMetrics(
    organizationId: string,
    month: number,
    year: number,
    data: {
      monthlyLeads?: number | null;
      qualifiedLeads?: number | null;
      opportunities?: number | null;
      closedDeals?: number | null;
      conversionRate?: number | null;
      averageSalesCycle?: number | null;
      averageDealSize?: number | null;
      topSellingProduct?: string | null;
      metricSource?: string;
    }
  ): Promise<SalesMetrics> {
    const record = {
      monthlyLeads: data.monthlyLeads ?? null,
      qualifiedLeads: data.qualifiedLeads ?? null,
      opportunities: data.opportunities ?? null,
      closedDeals: data.closedDeals ?? null,
      conversionRate: data.conversionRate ?? null,
      averageSalesCycle: data.averageSalesCycle ?? null,
      averageDealSize: data.averageDealSize ?? null,
      topSellingProduct: data.topSellingProduct ?? null,
      metricSource: data.metricSource || 'manual'
    };

    return prisma.salesMetrics.upsert({
      where: {
        organizationId_month_year: { organizationId, month, year }
      },
      update: record,
      create: { organizationId, month, year, ...record }
    });
  }

  /**
   * Upserts monthly marketing indicators
   */
  static async upsertMarketingMetrics(
    organizationId: string,
    month: number,
    year: number,
    data: {
      monthlyMarketingSpend?: number | null;
      websiteVisitors?: number | null;
      socialFollowers?: number | null;
      emailSubscribers?: number | null;
      ctr?: number | null;
      roi?: number | null;
      googleAdsSpend?: number | null;
      metaAdsSpend?: number | null;
      instagramSpend?: number | null;
      linkedinSpend?: number | null;
      metricSource?: string;
    }
  ): Promise<MarketingMetrics> {
    const record = {
      monthlyMarketingSpend: data.monthlyMarketingSpend ?? null,
      websiteVisitors: data.websiteVisitors ?? null,
      socialFollowers: data.socialFollowers ?? null,
      emailSubscribers: data.emailSubscribers ?? null,
      ctr: data.ctr ?? null,
      roi: data.roi ?? null,
      googleAdsSpend: data.googleAdsSpend ?? null,
      metaAdsSpend: data.metaAdsSpend ?? null,
      instagramSpend: data.instagramSpend ?? null,
      linkedinSpend: data.linkedinSpend ?? null,
      metricSource: data.metricSource || 'manual'
    };

    return prisma.marketingMetrics.upsert({
      where: {
        organizationId_month_year: { organizationId, month, year }
      },
      update: record,
      create: { organizationId, month, year, ...record }
    });
  }

  /**
   * Upserts monthly customer satisfaction indicators
   */
  static async upsertCustomerMetrics(
    organizationId: string,
    month: number,
    year: number,
    data: {
      activeCustomers?: number | null;
      newCustomers?: number | null;
      retentionRate?: number | null;
      churnRate?: number | null;
      nps?: number | null;
      customerSatisfaction?: number | null;
      supportTickets?: number | null;
      averageResponseTime?: number | null;
      metricSource?: string;
    }
  ): Promise<CustomerMetrics> {
    const record = {
      activeCustomers: data.activeCustomers ?? null,
      newCustomers: data.newCustomers ?? null,
      retentionRate: data.retentionRate ?? null,
      churnRate: data.churnRate ?? null,
      nps: data.nps ?? null,
      customerSatisfaction: data.customerSatisfaction ?? null,
      supportTickets: data.supportTickets ?? null,
      averageResponseTime: data.averageResponseTime ?? null,
      metricSource: data.metricSource || 'manual'
    };

    return prisma.customerMetrics.upsert({
      where: {
        organizationId_month_year: { organizationId, month, year }
      },
      update: record,
      create: { organizationId, month, year, ...record }
    });
  }

  /**
   * Persists recalculated KPI scores and alerts
   */
  static async upsertKPIMetrics(
    organizationId: string,
    data: {
      businessHealthScore?: number | null;
      growthScore?: number | null;
      revenueOpportunity?: number | null;
      leadScore?: number | null;
      customerHealth?: number | null;
      marketReadiness?: number | null;
      riskScore?: number | null;
      executiveSummary?: string | null;
    }
  ): Promise<KPIMetrics> {
    return prisma.kPIMetrics.upsert({
      where: { organizationId },
      update: data,
      create: { organizationId, ...data }
    });
  }

  /**
   * Mock legacy metrics getter for backward compatibility (maps new tables to old structures)
   */
  static async getMetrics(organizationId: string): Promise<any[]> {
    const fin = await prisma.financialMetrics.findMany({
      where: { organizationId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
    return fin.map(f => ({
      metricName: 'revenue',
      value: f.monthlyRevenue ? Number(f.monthlyRevenue) : 0,
      period: 'monthly',
      timestamp: new Date()
    }));
  }
}
