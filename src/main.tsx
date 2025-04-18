import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { updateLocaleSettings } from './utils/currency/currencyFormatter';

const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localeInfo, setLocaleInfo] = React.useState({
    country: "Colombia",
    countryCode: "CO",
    currency: "Peso Colombiano",
    currencyCode: "COP",
    locale: "es-CO",
    loading: true,
    error: null
  });

  React.useEffect(() => {
    const detectLocale = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        const countryCode = data.country_code;
        const currencyCode = data.currency;
        const country = data.country_name;
        
        const language = data.languages?.split(',')[0]?.split('-')[0] || 'en';
        const locale = `${language}-${countryCode}`;
        
        console.log('Detected locale:', locale);
        console.log('Detected country:', country);
        console.log('Detected currency:', currencyCode);
        
        const getCurrencyName = (code: string): string => {
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
          };
          
          return currencyNames[code] || code;
        };
        
        const detectedLocaleInfo = {
          country,
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          locale,
          loading: false,
          error: null
        };
        
        setLocaleInfo(detectedLocaleInfo);
        
        updateLocaleSettings(locale, currencyCode);
        
        localStorage.setItem('detectedLocale', JSON.stringify(detectedLocaleInfo));
      } catch (error) {
        console.error('Error detecting locale:', error);
        
        try {
          const browserLocale = navigator.language;
          const countryCode = browserLocale.split('-')[1] || 'CO';
          
          const getCountryName = (code: string): string => {
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
            };
            
            return countryNames[code] || code;
          };
          
          const fallbackInfo = {
            country: getCountryName(countryCode),
            countryCode,
            currency: "Peso Colombiano",
            currencyCode: "COP",
            locale: browserLocale || 'es-CO',
            loading: false,
            error: "Could not detect precise location. Using browser language settings."
          };
          
          setLocaleInfo(fallbackInfo);
          updateLocaleSettings(fallbackInfo.locale, fallbackInfo.currencyCode);
          localStorage.setItem('detectedLocale', JSON.stringify(fallbackInfo));
        } catch (fallbackError) {
          const defaultInfo = {
            ...localeInfo,
            loading: false,
            error: "Failed to detect locale. Using default Colombian settings."
          };
          setLocaleInfo(defaultInfo);
          updateLocaleSettings(defaultInfo.locale, defaultInfo.currencyCode);
          localStorage.setItem('detectedLocale', JSON.stringify(defaultInfo));
        }
      }
    };
    
    detectLocale();
  }, []);

  return <>{children}</>;
};

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </React.StrictMode>
);
