
/**
 * Utility functions for currency formatting and parsing
 */

/**
 * Format a number value to a currency string with thousand separators and decimal comma
 * @param value Number to format
 * @returns Formatted string like "1.234,56"
 */
export const formatCurrencyValue = (value: number): string => {
  try {
    if (isNaN(value) || value === 0) {
      return "0";
    }
    
    // Format as integer
    const valueStr = Math.floor(value).toString();
    
    // Format with thousand separators
    let formattedInteger = '';
    for (let i = 0; i < valueStr.length; i++) {
      if (i > 0 && (valueStr.length - i) % 3 === 0) {
        formattedInteger += '.';
      }
      formattedInteger += valueStr[i];
    }
    
    return formattedInteger;
  } catch (error) {
    console.error('Error formatting currency value:', error);
    return '0';
  }
};

/**
 * Parse a formatted currency string back to a number
 * @param formattedValue String like "1.234,56" to parse
 * @returns Number value like 1234.56
 */
export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue || !formattedValue.trim()) return 0;

  // Replace thousand separators
  const cleanValue = formattedValue.replace(/\./g, '');
  
  try {
    // Convert to integer
    const result = parseInt(cleanValue) || 0;
    if (isNaN(result) || !isFinite(result)) {
      console.warn("Number parsing resulted in invalid value:", result);
      return 0;
    }
    return result;
  } catch (e) {
    console.error("Error parsing currency value:", e);
    return 0;
  }
};

/**
 * Get an appropriate placeholder for currency input based on locale
 */
export const getCurrencyPlaceholder = (thousandSeparator: string = '.', decimalSeparator: string = ','): string => {
  return `10${thousandSeparator}000`;
};

/**
 * Get currency display information for a specific currency code
 */
export const getCurrencyDisplayInfo = (currencyCode: string): { symbol: string, position: 'prefix' | 'suffix' } => {
  const currencyInfo: Record<string, { symbol: string, position: 'prefix' | 'suffix' }> = {
    'USD': { symbol: '$', position: 'prefix' },
    'EUR': { symbol: '€', position: 'suffix' },
    'GBP': { symbol: '£', position: 'prefix' },
    'COP': { symbol: '$', position: 'prefix' },
    'MXN': { symbol: '$', position: 'prefix' },
    'BRL': { symbol: 'R$', position: 'prefix' },
    'JPY': { symbol: '¥', position: 'prefix' },
    'CNY': { symbol: '¥', position: 'prefix' },
    'INR': { symbol: '₹', position: 'prefix' },
    'AUD': { symbol: 'A$', position: 'prefix' },
    'CAD': { symbol: 'C$', position: 'prefix' },
    'CHF': { symbol: 'CHF', position: 'prefix' },
  };
  
  return currencyInfo[currencyCode] || { symbol: currencyCode, position: 'suffix' };
};
