
import { useState, useEffect } from 'react';

interface LocaleInfo {
  locale: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
}

export function useCurrencyLocale(): LocaleInfo {
  const [localeInfo, setLocaleInfo] = useState<LocaleInfo>({
    locale: 'en-US',
    currency: 'US Dollar',
    currencyCode: 'USD',
    currencySymbol: '$'
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

        setLocaleInfo({
          locale: parsed.locale || 'en-US',
          currency: parsed.currency || 'US Dollar',
          currencyCode: parsed.currencyCode || 'USD',
          currencySymbol: currencySymbol
        });
      }
    } catch (e) {
      console.error("Error parsing stored locale:", e);
    }
  }, []);

  return localeInfo;
}

export default useCurrencyLocale;
