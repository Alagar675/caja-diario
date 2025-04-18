
import { useState, useEffect } from "react";
import { getCurrencyName, getCurrencySymbol } from "@/utils/currency/currencyHelpers";
import { getCountryName, getDefaultCurrencyForCountry } from "@/utils/locale/countryHelpers";
import { getSeparatorsForLocale } from "@/utils/locale/localeFormatters";
import { detectGeoLocation } from "@/services/geoLocationService";

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
    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('detectedGeoLocale');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocaleInfo({ ...parsed, loading: false, error: null });
          return true;
        } catch (e) {
          console.error('Error parsing stored locale:', e);
        }
      }
      return false;
    };

    const detectLocale = async () => {
      try {
        const data = await detectGeoLocation();
        
        const countryCode = data.country_code;
        const currencyCode = data.currency;
        
        // Create locale string based on country code and language
        const language = data.languages?.split(',')[0]?.split('-')[0] || 'en';
        const locale = `${language}-${countryCode}`;
        
        const { decimalSeparator, thousandSeparator } = getSeparatorsForLocale(locale);
        
        const detectedInfo = {
          country: data.country_name,
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          currencySymbol: getCurrencySymbol(currencyCode),
          locale,
          decimalSeparator,
          thousandSeparator,
          loading: false,
          error: null
        };
        
        setLocaleInfo(detectedInfo);
        localStorage.setItem('detectedGeoLocale', JSON.stringify(detectedInfo));
      } catch (error) {
        console.error('Error detecting locale:', error);
        
        // Fallback to browser language
        const browserLocale = navigator.language;
        const countryCode = browserLocale.split('-')[1] || 'CO';
        const currencyCode = getDefaultCurrencyForCountry(countryCode);
        
        const fallbackInfo = {
          country: getCountryName(countryCode),
          countryCode,
          currency: getCurrencyName(currencyCode),
          currencyCode,
          currencySymbol: getCurrencySymbol(currencyCode),
          locale: browserLocale || 'es-CO',
          ...getSeparatorsForLocale(browserLocale),
          loading: false,
          error: "Could not detect precise location. Using browser language settings."
        };
        
        setLocaleInfo(fallbackInfo);
        localStorage.setItem('detectedGeoLocale', JSON.stringify(fallbackInfo));
      }
    };
    
    if (!loadFromLocalStorage()) {
      detectLocale();
    }
  }, []);
  
  return localeInfo;
}
