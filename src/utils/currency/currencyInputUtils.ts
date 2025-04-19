
export const formatCurrencyInput = (value: string, hideDecimals: boolean = false): string => {
  // Remove any leading non-numeric characters (except digits 1-9)
  value = value.replace(/^[^1-9]*/, '').replace(/[^\d]/g, "");
  
  if (value.length === 0) {
    return "";
  }

  // Handle right-to-left input formatting
  const len = value.length;
  const decimalPart = len > 2 ? value.slice(-2) : value.padStart(2, '0');
  const integerPart = len > 2 ? value.slice(0, -2) : '';
  
  // Add thousand separators from right to left
  const formattedInteger = integerPart ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : '';
  
  return hideDecimals ? formattedInteger : `${formattedInteger}${formattedInteger ? ',' : ''}${decimalPart}`;
};

export const stripNonNumeric = (value: string): string => {
  return value.replace(/[^\d]/g, '');
};

export const handleCurrencyInput = (value: string, onChange: (value: string) => void) => {
  // Clear input if starts with non-numeric characters from 1-9
  if (value.match(/^[^1-9]/)) {
    onChange('');
    return;
  }
  
  const numericValue = stripNonNumeric(value);
  const formattedValue = formatCurrencyInput(numericValue);
  onChange(formattedValue);
};
