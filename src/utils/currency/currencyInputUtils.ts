
export const formatCurrencyInput = (value: string, hideDecimals: boolean = false): string => {
  // Remove any non-numeric characters
  value = value.replace(/[^\d]/g, "");
  
  if (value.length === 0) {
    return "";
  }

  // Format with thousand separators and decimals
  const len = value.length;
  const decimalPart = len > 2 ? value.slice(-2) : value.padStart(2, '0');
  const integerPart = len > 2 ? value.slice(0, -2) : value;
  
  // Add thousand separators immediately as numbers are typed
  const formattedInteger = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
  
  return hideDecimals ? formattedInteger : `${formattedInteger}${formattedInteger ? ',' : ''}${decimalPart}`;
};
