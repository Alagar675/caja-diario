
import { useState, useEffect } from "react";

interface GeoLocaleInfo {
  country: string;
  countryCode: string;
  currency: string;
  currencyCode: string;
  currencySymbol: string;
  locale: string;
  decimalSeparator: string;
  thousandSeparator: string;
  loading: boolean;
  error: string | null;
}

const defaultLocale: GeoLocaleInfo = {
  country: "Colombia",
  countryCode: "CO",
  currency: "Peso Colombiano",
  currencyCode: "COP",
  currencySymbol: "$",
  locale: "es-CO",
  decimalSeparator: ',',
  thousandSeparator: '.',
  loading: true,
  error: null
};

export function useGeoLocaleDetection(): GeoLocaleInfo {
  const [localeInfo, setLocaleInfo] = useState<GeoLocaleInfo>(defaultLocale);

  useEffect(() => {
    const detectLocale = async () => {
      try {
        // Use a free geolocation API
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
        
        // Determine currency symbol based on currency code
        const currencySymbol = getCurrencySymbol(currencyCode);
        
        // Determine separators based on locale
        const { decimalSeparator, thousandSeparator } = getSeparatorsForLocale(locale);
        
        setLocaleInfo({
          country,
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          currencySymbol,
          locale,
          decimalSeparator,
          thousandSeparator,
          loading: false,
          error: null
        });
        
        // Store in localStorage for persistence
        localStorage.setItem('detectedGeoLocale', JSON.stringify({
          country,
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          currencySymbol,
          locale,
          decimalSeparator,
          thousandSeparator
        }));
      } catch (error) {
        console.error('Error detecting locale:', error);
        
        // Fallback to browser language if geolocation fails
        try {
          const browserLocale = navigator.language;
          const countryCode = browserLocale.split('-')[1] || 'CO';
          const currencyCode = getDefaultCurrencyForCountry(countryCode);
          const currencySymbol = getCurrencySymbol(currencyCode);
          const { decimalSeparator, thousandSeparator } = getSeparatorsForLocale(browserLocale);
          
          const fallbackInfo = {
            country: getCountryName(countryCode),
            countryCode,
            currency: getCurrencyName(currencyCode),
            currencyCode,
            currencySymbol,
            locale: browserLocale || 'es-CO',
            decimalSeparator,
            thousandSeparator,
            loading: false,
            error: "Could not detect precise location. Using browser language settings."
          };
          
          setLocaleInfo(fallbackInfo);
          localStorage.setItem('detectedGeoLocale', JSON.stringify(fallbackInfo));
        } catch (fallbackError) {
          // If all fails, use default Colombian locale
          setLocaleInfo({
            ...defaultLocale,
            loading: false,
            error: "Failed to detect locale. Using default Colombian settings."
          });
          localStorage.setItem('detectedGeoLocale', JSON.stringify(defaultLocale));
        }
      }
    };
    
    // Try to load from localStorage first for faster initial render
    const storedLocale = localStorage.getItem('detectedGeoLocale');
    if (storedLocale) {
      try {
        const parsedLocale = JSON.parse(storedLocale);
        setLocaleInfo({
          ...parsedLocale,
          loading: false,
          error: null
        });
      } catch (e) {
        console.error('Error parsing stored locale:', e);
      }
    }
    
    // Always try to detect locale, even if we have a stored one
    detectLocale();
  }, []);
  
  return localeInfo;
}

// Helper function to get currency symbol from code
function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "COP": "$",
    "MXN": "$",
    "ARS": "$",
    "BRL": "R$",
    "CAD": "$",
    "AUD": "$",
    "CNY": "¥",
    "INR": "₹",
    "CHF": "Fr",
    "SEK": "kr",
    "NOK": "kr",
    "DKK": "kr",
  };
  
  return symbols[code] || code;
}

// Helper function to get default currency for country code
function getDefaultCurrencyForCountry(code: string): string {
  const currencies: Record<string, string> = {
    "US": "USD",
    "GB": "GBP",
    "ES": "EUR",
    "DE": "EUR",
    "FR": "EUR",
    "IT": "EUR",
    "JP": "JPY",
    "CO": "COP",
    "MX": "MXN",
    "AR": "ARS",
    "BR": "BRL",
    "CA": "CAD",
    "AU": "AUD",
    "CN": "CNY",
    "IN": "INR",
    "CH": "CHF",
    "SE": "SEK",
    "NO": "NOK",
    "DK": "DKK",
  };
  
  return currencies[code] || "USD";
}

// Helper function to get separators for locale
function getSeparatorsForLocale(locale: string): { decimalSeparator: string, thousandSeparator: string } {
  // Default to Latin America style (periods for thousands, commas for decimals)
  let decimalSeparator = ',';
  let thousandSeparator = '.';
  
  // Check for English-speaking or Asian countries that typically use the opposite format
  if (locale.startsWith('en') || locale.includes('JP') || locale.includes('CN') || locale.includes('KR')) {
    decimalSeparator = '.';
    thousandSeparator = ',';
  }
  
  return { decimalSeparator, thousandSeparator };
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
    "CNY": "Chinese Yuan",
    "INR": "Indian Rupee",
    "CHF": "Swiss Franc",
    "SEK": "Swedish Krona",
    "NOK": "Norwegian Krone",
    "DKK": "Danish Krone",
  };
  
  return currencyNames[code] || code;
}

// Helper function to get country name from code
function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    "US": "United States",
    "GB": "United Kingdom",
    "ES": "Spain",
    "DE": "Germany",
    "FR": "France",
    "IT": "Italy",
    "JP": "Japan",
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
    "CN": "China",
    "IN": "India",
    "CH": "Switzerland",
    "SE": "Sweden",
    "NO": "Norway",
    "DK": "Denmark",
  };
  
  return countryNames[code] || code;
}
