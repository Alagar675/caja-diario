
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
      return "0,00";
    }
    
    const valueStr = value.toFixed(2);
    const parts = valueStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : '00';
    
    // Format with thousand separators
    let formattedInteger = '';
    for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
        formattedInteger += '.';
      }
      formattedInteger += integerPart[i];
    }
    
    return `${formattedInteger},${decimalPart}`;
  } catch (error) {
    console.error('Error formatting currency value:', error);
    return '0,00';
  }
};

/**
 * Parse a formatted currency string back to a number
 * @param formattedValue String like "1.234,56" to parse
 * @returns Number value like 1234.56
 */
export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue || !formattedValue.trim()) return 0;

  // Replace thousand separators and convert decimal comma to point
  const cleanValue = formattedValue.replace(/\./g, '').replace(',', '.');
  
  try {
    const result = parseFloat(cleanValue) || 0;
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
  return `10${thousandSeparator}000${decimalSeparator}00`;
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
