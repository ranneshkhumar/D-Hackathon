export class NormalizationService {
  private static mappings: Record<string, string[]> = {
    monthlyRevenue: ['revenue', 'revenue (inr)', 'monthly revenue', 'income', 'rev', 'earnings', 'monthly rev', 'sales'],
    monthlyExpenses: ['expenses', 'spent', 'monthly expenses', 'cost', 'outgoings', 'expenses (inr)', 'monthly spend'],
    monthlyMarketingSpend: ['marketing spend', 'marketing budget', 'ad spend', 'ads', 'promo', 'promo spend', 'marketing'],
    activeCustomers: ['customers', 'active customers', 'users', 'accounts', 'subscriber count', 'customer count', 'active_customers'],
    conversionRate: ['conversion rate', 'conversion', 'conversions', 'close rate', 'conversion %'],
    customerSatisfaction: ['satisfaction', 'csat', 'customer satisfaction', 'rating', 'csat_score'],
    month: ['month', 'm', 'period month', 'billing month'],
    year: ['year', 'y', 'period year', 'billing year']
  };

  /**
   * Detects and returns a map of CSV index positions to normalized property names.
   */
  static detectHeaders(headerRow: string[]): Record<string, number> {
    const headerMap: Record<string, number> = {};

    headerRow.forEach((cell, index) => {
      const cleanCell = cell.toLowerCase().trim().replace(/[\s-_]+/g, ' ');
      
      for (const [normalizedKey, synonyms] of Object.entries(this.mappings)) {
        if (synonyms.includes(cleanCell)) {
          headerMap[normalizedKey] = index;
          break;
        }
      }
    });

    return headerMap;
  }

  /**
   * Sanitizes currency strings, percent symbols, commas, and parses to a floating point number.
   */
  static normalizeNumber(value: string | null | undefined): number | null {
    if (value === null || value === undefined || value.trim() === '') {
      return null;
    }

    // Strip currency symbols, commas, percent signs, and whitespace
    const cleanStr = value.replace(/[₹$%,]/g, '').trim();
    const parsed = parseFloat(cleanStr);
    
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Helper to parse integer fields (like month, year, or customer count)
   */
  static normalizeInteger(value: string | null | undefined): number | null {
    const num = this.normalizeNumber(value);
    return num !== null ? Math.round(num) : null;
  }
}
