
import { useState, useEffect } from 'react';
import { updateLocaleSettings } from '@/utils/formatters';

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
    locale: 'es-CO',
    currency: 'Peso Colombiano',
    currencyCode: 'COP',
    currencySymbol: '$',
    decimalSeparator: ',',
    thousandSeparator: '.'
  });

  useEffect(() => {
    try {
      const storedLocale = localStorage.getItem('detectedLocale');
      if (storedLocale) {
        const parsed = JSON.parse(storedLocale);
        
        // Determine currency symbol based on currency code
        const currencySymbol = 
          parsed?.currencyCode === 'USD' ? '$' :
          parsed?.currencyCode === 'EUR' ? '€' :
          parsed?.currencyCode === 'GBP' ? '£' : 
          parsed?.currencyCode === 'COP' ? '$' : '$';

        // Determine decimal and thousands separators based on locale
        let decimalSeparator = ',';
        let thousandSeparator = '.';
        
        if (parsed.locale === 'en-US' || parsed.locale === 'en-GB') {
          decimalSeparator = '.';
          thousandSeparator = ',';
        }

        const updatedLocaleInfo = {
          locale: parsed.locale || 'es-CO',
          currency: parsed.currency || 'Peso Colombiano',
          currencyCode: parsed.currencyCode || 'COP',
          currencySymbol: currencySymbol,
          decimalSeparator,
          thousandSeparator
        };

        setLocaleInfo(updatedLocaleInfo);
        
        // Update the global locale settings for formatters
        updateLocaleSettings(updatedLocaleInfo.locale, updatedLocaleInfo.currencyCode);
      } else {
        // If no stored locale, use the default and update the global settings
        updateLocaleSettings(localeInfo.locale, localeInfo.currencyCode);
      }
    } catch (e) {
      console.error("Error parsing stored locale:", e);
    }
  }, []);

  return localeInfo;
}

export default useCurrencyLocale;
