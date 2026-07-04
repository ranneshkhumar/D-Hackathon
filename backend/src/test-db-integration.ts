import { prisma } from './config/db';
import { OrgRepository } from './repositories/org.repository';
import { KpiCalculationService } from './services/kpi-calculation.service';
import { AgentExecutionService } from './services/agent-execution.service';

async function runTest() {
  console.log('\n--- STARTING INTEGRATION TEST RUN ---\n');
  
  try {
    // 1. Create organization
    console.log('[1/5] Creating Test Organization...');
    const orgName = `Test Enterprise ${Math.floor(Math.random() * 1000)}`;
    const org = await OrgRepository.create(orgName, 'Healthcare', 'https://test-enterprise.org');
    console.log(`Successfully created Organization: ${org.name} (ID: ${org.id})`);

    // 2. Ingest mock financial indicators
    console.log('[2/5] Inserting Financial Metrics...');
    await OrgRepository.upsertFinancialMetrics(org.id, 7, 2026, {
      monthlyRevenue: 500000,
      monthlyExpenses: 350000,
      profitMargin: 30,
      metricSource: 'manual'
    });
    console.log('Successfully inserted monthly financial metrics.');

    // 3. Recalculate KPIs
    console.log('[3/5] Recalculating KPIs...');
    const kpis = await KpiCalculationService.calculateKPIs(org.id);
    console.log('KPI Recalculation Results:', {
      businessHealthScore: kpis.businessHealthScore,
      growthScore: kpis.growthScore,
      revenueOpportunity: kpis.revenueOpportunity?.toString(),
      executiveSummary: kpis.executiveSummary
    });

    // 4. Trigger Boardroom Strategy agents via Gemini AI
    console.log('[4/5] Executing Boardroom Multi-Agent Strategy Run (Pinging Gemini)...');
    const { SessionRepository } = require('./repositories/session.repository');
    const session = await SessionRepository.createSession(org.id, 'Test Growth Audit Session');
    
    // Execute plan for Strategy and CEO summary
    const plan = ['Finance', 'Marketing', 'Sales', 'CustomerSuccess'];
    const results = await AgentExecutionService.executePlan(org.id, session.id, plan);
    console.log('Multi-Agent Execution succeeded.');
    console.log('CEO Summary:', results.executiveReport?.executiveSummary);
    console.log('Strategic Priorities:', results.executiveReport?.strategicPriorities);

    // 5. Cleanup database test records
    console.log('[5/5] Cleaning up test records...');
    await OrgRepository.delete(org.id);
    console.log('Test Organization clean up complete.');
    console.log('\n--- INTEGRATION TEST SUCCESSFUL ---\n');
  } catch (error) {
    console.error('\n--- INTEGRATION TEST FAILED ---\n');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

runTest();
