export class ValidationService {
  /**
   * Validates parsed metrics row inputs, filtering invalid cells or bounding errors.
   */
  static validateFinancialRow(row: {
    monthlyRevenue?: number | null;
    monthlyExpenses?: number | null;
    month?: number | null;
    year?: number | null;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (row.monthlyRevenue !== undefined && row.monthlyRevenue !== null && row.monthlyRevenue < 0) {
      errors.push('Revenue cannot be a negative value');
    }

    if (row.monthlyExpenses !== undefined && row.monthlyExpenses !== null && row.monthlyExpenses < 0) {
      errors.push('Expenses cannot be a negative value');
    }

    if (row.month !== undefined && row.month !== null && (row.month < 1 || row.month > 12)) {
      errors.push('Month must be an integer between 1 and 12');
    }

    if (row.year !== undefined && row.year !== null && (row.year < 1900 || row.year > 2100)) {
      errors.push('Year must be a valid 4-digit Gregorian calendar year');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validates percentage values (conversion rate, retention rate, margins) are within standard boundaries.
   */
  static clampPercentage(value: number | null): number | null {
    if (value === null) return null;
    if (value < 0) return 0;
    if (value > 100) {
      // If conversion is formatted as a fraction (e.g. 0.85 instead of 85%), normalize to percentage bounds
      if (value <= 1) {
        return value * 100;
      }
      return 100;
    }
    return value;
  }
}
