
export const getSeparatorsForLocale = (locale: string): { decimalSeparator: string, thousandSeparator: string } => {
  // Default to Latin America style (periods for thousands, commas for decimals)
  let decimalSeparator = ',';
  let thousandSeparator = '.';
  
  // Check for English-speaking or Asian countries that typically use the opposite format
  if (locale.startsWith('en') || locale.includes('JP') || locale.includes('CN') || locale.includes('KR')) {
    decimalSeparator = '.';
    thousandSeparator = ',';
  }
  
  return { decimalSeparator, thousandSeparator };
};
