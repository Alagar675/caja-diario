
// Store locale settings
let currentLocale = 'es-CO';
let currentCurrency = 'COP';

export const updateLocaleSettings = (locale: string, currency: string) => {
  currentLocale = locale;
  currentCurrency = currency;
  console.log(`Locale settings updated: ${locale} / ${currency}`);
};

export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currentCurrency} Error`;
  }
};

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

