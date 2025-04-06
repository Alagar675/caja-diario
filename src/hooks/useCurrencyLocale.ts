
import { useState, useEffect } from 'react';

interface LocaleInfo {
  locale: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  decimalSeparator: string;
  thousandSeparator: string;
}

export function useCurrencyLocale(): LocaleInfo {
  const [localeInfo, setLocaleInfo] = useState<LocaleInfo>({
    locale: 'en-US',
    currency: 'US Dollar',
    currencyCode: 'USD',
    currencySymbol: '$',
    decimalSeparator: '.',
    thousandSeparator: ','
  });

  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem('detectedLocale');
      if (storedLocale) {
        const parsed = JSON.parse(storedLocale);
        
        const currencySymbol = 
          parsed?.currencyCode === 'USD' ? '$' :
          parsed?.currencyCode === 'EUR' ? '€' :
          parsed?.currencyCode === 'GBP' ? '£' : '$';

        // Determine decimal and thousands separators based on locale
        let decimalSeparator = ',';
        let thousandSeparator = '.';
        
        if (parsed.locale === 'en-US' || parsed.locale === 'en-GB') {
          decimalSeparator = '.';
          thousandSeparator = ',';
        }

        setLocaleInfo({
          locale: parsed.locale || 'en-US',
          currency: parsed.currency || 'US Dollar',
          currencyCode: parsed.currencyCode || 'USD',
          currencySymbol: currencySymbol,
          decimalSeparator,
          thousandSeparator
        });
      }
    } catch (e) {
      console.error("Error parsing stored locale:", e);
    }
  }, []);

  return localeInfo;
}

export default useCurrencyLocale;
