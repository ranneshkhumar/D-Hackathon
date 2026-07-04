import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { prisma } from '../config/db';
import { OrgRepository } from '../repositories/org.repository';
import { SessionRepository } from '../repositories/session.repository';
import { CsvParserService } from '../services/csv-parser.service';
import { NormalizationService } from '../services/normalization.service';
import { ValidationService } from '../services/validation.service';
import { KpiCalculationService } from '../services/kpi-calculation.service';

export class DiscoveryController {
  /**
   * Initializes a conversational discovery session for onboarding.
   */
  static async start(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.body;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required to start onboarding' });
      }

      const session = await SessionRepository.createSession(organizationId, 'Business Onboarding Discovery');
      
      const greeting = 'Welcome! I am the CEO Agent. Let us configure your workspace. To start, tell me about your business. What is your core product or service?';
      await SessionRepository.addChatMessage(session.id, 'assistant', greeting);

      return res.status(200).json({
        message: 'Onboarding discovery session initialized successfully',
        sessionId: session.id,
        nextQuestion: greeting
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Receives user reply, extracts profile data, updates the database, and returns the next follow-up.
   */
  static async message(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { sessionId, message } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ error: 'Session ID and message body are required' });
      }

      await SessionRepository.addChatMessage(sessionId, 'user', message);

      const followUp = 'Thank you. Next, who are your primary competitors, and what are the main operational challenges you face today?';
      await SessionRepository.addChatMessage(sessionId, 'assistant', followUp);

      return res.status(200).json({
        message: 'Message processed',
        nextQuestion: followUp,
        discoveryComplete: false
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Processes manual onboarding form wizard submissions and dynamically recalculates KPIs.
   */
  static async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const {
        organizationId,
        company_name,
        industry,
        annual_revenue,
        target_audience,
        primary_goal,
        team_size,
        doc_text,
        marketing_budget,
        gross_margin,
        expenses
      } = req.body;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required' });
      }

      const parsedRevenue = Number(annual_revenue) || 0;
      const parsedExpenses = Number(expenses) || 0;
      const parsedMarketing = Number(marketing_budget) || 0;
      const parsedEmployees = Number(team_size) || null;
      const parsedMargin = Number(gross_margin) || 30;

      // Compute monthly increments
      const monthlyRevenue = parsedRevenue / 12;
      const monthlyExpenses = parsedExpenses / 12;
      const monthlyMarketing = parsedMarketing / 12;

      // 1. Sync Organization
      await prisma.organization.upsert({
        where: { id: organizationId },
        update: {
          name: company_name || 'Aegis Client Workspace',
          industry: industry || 'Retail',
          employeeCount: parsedEmployees
        },
        create: {
          id: organizationId,
          name: company_name || 'Aegis Client Workspace',
          industry: industry || 'Retail',
          employeeCount: parsedEmployees,
          kpiMetrics: {
            create: {}
          }
        }
      });

      // 2. Sync BusinessProfile
      await OrgRepository.upsertBusinessProfile(organizationId, {
        businessDescription: doc_text || '',
        targetAudience: target_audience || '',
        products: 'Core products line',
        services: 'Specialized business packages'
      });

      // 3. Reset and inject BusinessGoal
      if (primary_goal) {
        await OrgRepository.clearBusinessGoals(organizationId);
        await OrgRepository.addBusinessGoal(organizationId, {
          goalType: 'growth',
          description: primary_goal,
          status: 'ACTIVE',
          priority: 'HIGH'
        });
      }

      // 4. Save values in metrics tables
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      await OrgRepository.upsertFinancialMetrics(organizationId, month, year, {
        monthlyRevenue,
        monthlyExpenses,
        profitMargin: parsedMargin,
        cashFlow: monthlyRevenue - monthlyExpenses,
        grossProfit: monthlyRevenue * (parsedMargin / 100),
        burnRate: monthlyExpenses,
        metricSource: 'manual'
      });

      await OrgRepository.upsertMarketingMetrics(organizationId, month, year, {
        monthlyMarketingSpend: monthlyMarketing,
        metricSource: 'manual'
      });

      await OrgRepository.upsertSalesMetrics(organizationId, month, year, {
        conversionRate: 15,
        metricSource: 'manual'
      });

      await OrgRepository.upsertCustomerMetrics(organizationId, month, year, {
        customerSatisfaction: 85,
        retentionRate: 90,
        metricSource: 'manual'
      });

      // 5. Dynamic recalculation
      const kpis = await KpiCalculationService.calculateKPIs(organizationId);

      return res.status(200).json({
        message: 'Onboarding data submitted and KPIs calculated successfully',
        success: true,
        kpis
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Processes uploaded CSV sheets, parses values, normalizes them, and syncs databases.
   */
  static async uploadCsv(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.body;
      const file = req.file;

      if (!organizationId) {
        return res.status(400).json({ error: 'Organization ID is required' });
      }

      if (!file) {
        return res.status(400).json({ error: 'CSV file attachment is required' });
      }

      // Ensure organization exists in database before proceeding with metrics upsertion
      let org = await prisma.organization.findUnique({ where: { id: organizationId } });
      if (!org) {
        org = await prisma.organization.create({
          data: {
            id: organizationId,
            name: 'Aegis CSV Import Workspace',
            industry: 'Retail',
            kpiMetrics: {
              create: {}
            }
          }
        });
      }

      const csvContent = file.buffer.toString('utf-8');
      const csvData = CsvParserService.parse(csvContent);

      if (csvData.length < 2) {
        return res.status(400).json({ error: 'CSV file must contain a header row and at least one metric row' });
      }

      const headerRow = csvData[0];
      const headerIndices = NormalizationService.detectHeaders(headerRow);

      let rowsImported = 0;
      let rowsRejected = 0;
      const rejectionErrors: string[] = [];

      const now = new Date();
      let defaultMonth = now.getMonth() + 1;
      let defaultYear = now.getFullYear();

      for (let i = 1; i < csvData.length; i++) {
        const row = csvData[i];
        if (!row || row.length === 0 || row.every(cell => cell === '')) continue;

        const rawRevenue = headerIndices.monthlyRevenue !== undefined ? row[headerIndices.monthlyRevenue] : null;
        const rawExpenses = headerIndices.monthlyExpenses !== undefined ? row[headerIndices.monthlyExpenses] : null;
        const rawMarketing = headerIndices.monthlyMarketingSpend !== undefined ? row[headerIndices.monthlyMarketingSpend] : null;
        const rawCustomers = headerIndices.activeCustomers !== undefined ? row[headerIndices.activeCustomers] : null;
        const rawConversion = headerIndices.conversionRate !== undefined ? row[headerIndices.conversionRate] : null;
        const rawCSAT = headerIndices.customerSatisfaction !== undefined ? row[headerIndices.customerSatisfaction] : null;
        const rawMonth = headerIndices.month !== undefined ? row[headerIndices.month] : null;
        const rawYear = headerIndices.year !== undefined ? row[headerIndices.year] : null;

        const monthlyRevenue = NormalizationService.normalizeNumber(rawRevenue);
        const monthlyExpenses = NormalizationService.normalizeNumber(rawExpenses);
        const monthlyMarketingSpend = NormalizationService.normalizeNumber(rawMarketing);
        const activeCustomers = NormalizationService.normalizeInteger(rawCustomers);
        const conversionRate = ValidationService.clampPercentage(NormalizationService.normalizeNumber(rawConversion));
        const customerSatisfaction = ValidationService.clampPercentage(NormalizationService.normalizeNumber(rawCSAT));

        const month = NormalizationService.normalizeInteger(rawMonth) || defaultMonth;
        const year = NormalizationService.normalizeInteger(rawYear) || defaultYear;

        const validation = ValidationService.validateFinancialRow({
          monthlyRevenue,
          monthlyExpenses,
          month,
          year
        });

        if (!validation.isValid) {
          rowsRejected++;
          rejectionErrors.push(`Row ${i} validation failures: ${validation.errors.join(', ')}`);
          continue;
        }

        if (rawMonth === null) {
          defaultMonth--;
          if (defaultMonth < 1) {
            defaultMonth = 12;
            defaultYear--;
          }
        }

        await OrgRepository.upsertFinancialMetrics(organizationId, month, year, {
          monthlyRevenue,
          monthlyExpenses,
          profitMargin: (monthlyRevenue && monthlyRevenue > 0) 
            ? ((monthlyRevenue - (monthlyExpenses || 0)) / monthlyRevenue) * 100 
            : 30,
          metricSource: 'csv'
        });

        if (monthlyMarketingSpend !== null) {
          await OrgRepository.upsertMarketingMetrics(organizationId, month, year, {
            monthlyMarketingSpend,
            metricSource: 'csv'
          });
        }

        if (activeCustomers !== null || customerSatisfaction !== null) {
          await OrgRepository.upsertCustomerMetrics(organizationId, month, year, {
            activeCustomers,
            customerSatisfaction,
            metricSource: 'csv'
          });
        }

        if (conversionRate !== null) {
          await OrgRepository.upsertSalesMetrics(organizationId, month, year, {
            conversionRate,
            metricSource: 'csv'
          });
        }

        rowsImported++;
      }

      // Log import history details
      await prisma.importHistory.create({
        data: {
          organizationId,
          fileName: file.originalname,
          importType: 'CSV_METRICS',
          rowsImported,
          rowsRejected,
          status: rowsRejected > 0 ? 'PARTIAL_SUCCESS' : 'COMPLETED',
          errorLog: rejectionErrors.length > 0 ? rejectionErrors.join(' | ') : null
        }
      });

      // Recalculate KPIs
      const kpis = await KpiCalculationService.calculateKPIs(organizationId);

      const headers = headerRow;
      const previewRows = csvData.slice(1, 11);

      return res.status(200).json({
        message: `CSV processing finished: ${rowsImported} rows saved successfully, ${rowsRejected} rows rejected`,
        success: true,
        summary: { rowsImported, rowsRejected },
        headers,
        previewRows,
        kpis
      });
    } catch (error) {
      next(error);
    }
  }
}
