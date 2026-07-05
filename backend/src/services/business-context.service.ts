import { OrgRepository } from '../repositories/org.repository';

export class BusinessContextService {
  /**
   * Aggregates finance, sales, marketing, operations, customer, and strategy models into a single consolidated payload.
   * This acts as the single source of truth for the multi-agent boardroom boardroom.
   */
  static async buildContext(organizationId: string): Promise<Record<string, any>> {
    const org = await OrgRepository.findById(organizationId);
    if (!org) {
      throw new Error(`Organization ${organizationId} not found`);
    }

    // Extract the latest monthly records
    const financial = org.financialMetrics[0] || null;
    const sales = org.salesMetrics[0] || null;
    const marketing = org.marketingMetrics[0] || null;
    const customer = org.customerMetrics[0] || null;
    const profile = org.businessProfile || null;
    const kpis = org.kpiMetrics || null;

    // Vector database knowledge-retrieval placeholder
    const vectorKnowledgeText = await this.getKnowledgeBaseContext(organizationId);

    return {
      organization: {
        id: org.id,
        name: org.name,
        website: org.website,
        industry: org.industry,
        employeeCount: org.employeeCount,
        branchCount: org.branchCount,
        foundedYear: org.foundedYear,
        currency: org.currency
      },
      profile: {
        businessDescription: profile?.businessDescription || '',
        businessModel: profile?.businessModel || '',
        products: profile?.products || '',
        services: profile?.services || '',
        targetAudience: profile?.targetAudience || '',
        competitors: profile?.competitors || '',
        vision: profile?.vision || '',
        mission: profile?.mission || ''
      },
      goals: org.businessGoals.map(g => ({
        goalType: g.goalType,
        description: g.description,
        targetValue: g.targetValue,
        deadline: g.deadline,
        priority: g.priority,
        status: g.status
      })),
      challenges: org.businessChallenges.map(c => ({
        category: c.category,
        description: c.description,
        severity: c.severity,
        status: c.status
      })),
      financialMetrics: {
        monthlyRevenue: financial?.monthlyRevenue ? Number(financial.monthlyRevenue) : null,
        monthlyExpenses: financial?.monthlyExpenses ? Number(financial.monthlyExpenses) : null,
        grossProfit: financial?.grossProfit ? Number(financial.grossProfit) : null,
        netProfit: financial?.netProfit ? Number(financial.netProfit) : null,
        profitMargin: financial?.profitMargin ? Number(financial.profitMargin) : null,
        cashFlow: financial?.cashFlow ? Number(financial.cashFlow) : null,
        burnRate: financial?.burnRate ? Number(financial.burnRate) : null,
        customerAcquisitionCost: financial?.customerAcquisitionCost ? Number(financial.customerAcquisitionCost) : null,
        customerLifetimeValue: financial?.customerLifetimeValue ? Number(financial.customerLifetimeValue) : null,
        averageOrderValue: financial?.averageOrderValue ? Number(financial.averageOrderValue) : null,
        metricSource: financial?.metricSource || 'manual'
      },
      salesMetrics: {
        monthlyLeads: sales?.monthlyLeads || null,
        qualifiedLeads: sales?.qualifiedLeads || null,
        opportunities: sales?.opportunities || null,
        closedDeals: sales?.closedDeals || null,
        conversionRate: sales?.conversionRate ? Number(sales.conversionRate) : null,
        averageSalesCycle: sales?.averageSalesCycle ? Number(sales.averageSalesCycle) : null,
        averageDealSize: sales?.averageDealSize ? Number(sales.averageDealSize) : null,
        topSellingProduct: sales?.topSellingProduct || null,
        metricSource: sales?.metricSource || 'manual'
      },
      marketingMetrics: {
        monthlyMarketingSpend: marketing?.monthlyMarketingSpend ? Number(marketing.monthlyMarketingSpend) : null,
        websiteVisitors: marketing?.websiteVisitors || null,
        socialFollowers: marketing?.socialFollowers || null,
        emailSubscribers: marketing?.emailSubscribers || null,
        ctr: marketing?.ctr ? Number(marketing.ctr) : null,
        roi: marketing?.roi ? Number(marketing.roi) : null,
        googleAdsSpend: marketing?.googleAdsSpend ? Number(marketing.googleAdsSpend) : null,
        metaAdsSpend: marketing?.metaAdsSpend ? Number(marketing.metaAdsSpend) : null,
        instagramSpend: marketing?.instagramSpend ? Number(marketing.instagramSpend) : null,
        linkedinSpend: marketing?.linkedinSpend ? Number(marketing.linkedinSpend) : null,
        metricSource: marketing?.metricSource || 'manual'
      },
      customerMetrics: {
        activeCustomers: customer?.activeCustomers || null,
        newCustomers: customer?.newCustomers || null,
        retentionRate: customer?.retentionRate ? Number(customer.retentionRate) : null,
        churnRate: customer?.churnRate ? Number(customer.churnRate) : null,
        nps: customer?.nps || null,
        customerSatisfaction: customer?.customerSatisfaction ? Number(customer.customerSatisfaction) : null,
        supportTickets: customer?.supportTickets || null,
        averageResponseTime: customer?.averageResponseTime ? Number(customer.averageResponseTime) : null,
        metricSource: customer?.metricSource || 'manual'
      },
      kpis: {
        businessHealthScore: kpis?.businessHealthScore || null,
        growthScore: kpis?.growthScore || null,
        revenueOpportunity: kpis?.revenueOpportunity ? Number(kpis.revenueOpportunity) : null,
        leadScore: kpis?.leadScore || null,
        customerHealth: kpis?.customerHealth || null,
        marketReadiness: kpis?.marketReadiness || null,
        riskScore: kpis?.riskScore || null,
        executiveSummary: kpis?.executiveSummary || ''
      },
      vectorKnowledge: vectorKnowledgeText
    };
  }

  /**
   * Pre-configured bridge method for ChromaDB context injection.
   * Currently acts as an empty placeholder to isolate vector requirements from domain interfaces.
   */
  private static async getKnowledgeBaseContext(organizationId: string): Promise<string> {
    // To be extended later with Chroma vector query lookups
    return '';
  }
}
