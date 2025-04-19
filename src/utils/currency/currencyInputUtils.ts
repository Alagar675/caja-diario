
/**
 * Currency input utility functions for right-to-left input formatting
 * with dot as thousand separator and comma as decimal separator
 */

export const formatCurrencyInput = (value: string, hideDecimals: boolean = false): string => {
  // If empty, return empty string
  if (!value || value === "") {
    return "";
  }

  // Ensure value is just digits
  value = value.replace(/\D/g, "");
  
  // Remove leading zeros
  value = value.replace(/^0+/, '');
  
  // If value becomes empty after removing zeros, return empty
  if (!value) {
    return "";
  }

  // Handle right-to-left input formatting (last two digits are decimal part)
  const len = value.length;
  const decimalPart = len > 2 ? value.slice(-2) : value.padStart(2, '0');
  const integerPart = len > 2 ? value.slice(0, -2) : '';
  
  // Add thousand separators from right to left
  let formattedInteger = '';
  if (integerPart) {
    formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  
  return hideDecimals ? formattedInteger : `${formattedInteger}${formattedInteger ? ',' : ''}${decimalPart}`;
};

/**
 * Strip all non-numeric characters
 */
export const stripNonNumeric = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Convert formatted currency string to numeric value
 */
export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  
  // Replace thousand separators and convert decimal comma to point
  const cleanValue = formattedValue.replace(/\./g, '').replace(',', '.');
  const numValue = parseFloat(cleanValue);
  
  return isNaN(numValue) ? 0 : numValue;
};

/**
 * Get placeholder text based on locale settings
 */
export const getCurrencyPlaceholder = (): string => {
  return "0,00";
};

