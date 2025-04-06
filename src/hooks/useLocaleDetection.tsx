
import { useState, useEffect } from "react";

interface LocaleInfo {
  country: string;
  countryCode: string;
  currency: string;
  currencyCode: string;
  locale: string;
  loading: boolean;
  error: string | null;
}

const defaultLocale: LocaleInfo = {
  country: "Colombia",
  countryCode: "CO",
  currency: "Peso Colombiano",
  currencyCode: "COP",
  locale: "es-CO",
  loading: true,
  error: null
};

export function useLocaleDetection(): LocaleInfo {
  const [localeInfo, setLocaleInfo] = useState<LocaleInfo>(defaultLocale);

  useEffect(() => {
    const detectLocale = async () => {
      try {
        // First try using a free geolocation API
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        // Map the country code to the locale and currency
        const countryCode = data.country_code;
        const currencyCode = data.currency;
        const country = data.country_name;
        
        // Create locale string based on country code and language
        const language = data.languages?.split(',')[0]?.split('-')[0] || 'en';
        const locale = `${language}-${countryCode}`;
        
        console.log('Detected locale:', locale);
        console.log('Detected country:', country);
        console.log('Detected currency:', currencyCode);
        
        setLocaleInfo({
          country,
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          locale,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error detecting locale:', error);
        
        // Fallback to browser language if geolocation fails
        try {
          const browserLocale = navigator.language;
          const countryCode = browserLocale.split('-')[1] || 'CO';
          
          setLocaleInfo({
            country: getCountryName(countryCode),
            countryCode,
            currency: "Peso Colombiano",
            currencyCode: "COP",
            locale: browserLocale || 'es-CO',
            loading: false,
            error: "Could not detect precise location. Using browser language settings."
          });
        } catch (fallbackError) {
          // If all fails, use default Colombian locale
          setLocaleInfo({
            ...defaultLocale,
            loading: false,
            error: "Failed to detect locale. Using default Colombian settings."
          });
        }
      }
    };
    
    detectLocale();
  }, []);
  
  return localeInfo;
}

// Helper function to get currency name from code
function getCurrencyName(code: string): string {
  const currencyNames: Record<string, string> = {
    "USD": "US Dollar",
    "EUR": "Euro",
    "GBP": "British Pound",
    "JPY": "Japanese Yen",
    "COP": "Peso Colombiano",
    "MXN": "Peso Mexicano",
    "CLP": "Peso Chileno",
    "ARS": "Peso Argentino",
    "PEN": "Sol Peruano",
    "BRL": "Real Brasileño",
    "BOB": "Boliviano",
    "VES": "Bolívar Venezolano",
    "UYU": "Peso Uruguayo",
    "PYG": "Guaraní Paraguayo",
    "CAD": "Canadian Dollar",
    "AUD": "Australian Dollar",
    // Add more currencies as needed
  };
  
  return currencyNames[code] || code;
}

// Helper function to get country name from code
function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    "US": "United States",
    "GB": "United Kingdom",
    "CO": "Colombia",
    "MX": "Mexico",
    "CL": "Chile",
    "AR": "Argentina",
    "PE": "Peru",
    "BR": "Brazil",
    "BO": "Bolivia",
    "VE": "Venezuela",
    "UY": "Uruguay",
    "PY": "Paraguay",
    "CA": "Canada",
    "AU": "Australia",
    // Add more countries as needed
  };
  
  return countryNames[code] || code;
}
