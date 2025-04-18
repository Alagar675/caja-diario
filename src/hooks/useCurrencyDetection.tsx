
import { useState, useEffect } from "react";

interface CurrencyInfo {
  code: string;
  symbol: string;
  label: string;
}

interface CurrencyDetectionResult {
  detectedCurrency: CurrencyInfo;
  currencyOptions: CurrencyInfo[];
  isLoading: boolean;
  error: string | null;
}

export function useCurrencyDetection(): CurrencyDetectionResult {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detectedCurrency, setDetectedCurrency] = useState<CurrencyInfo>({
    code: 'USD',
    symbol: '$',
    label: 'USD (US Dollar)'
  });

  const currencyOptions: CurrencyInfo[] = [
    { code: 'USD', symbol: '$', label: 'USD (US Dollar)' },
    { code: 'EUR', symbol: '€', label: 'EUR (Euro)' },
    { code: 'GBP', symbol: '£', label: 'GBP (British Pound)' },
    { code: 'JPY', symbol: '¥', label: 'JPY (Japanese Yen)' },
    { code: 'COP', symbol: '$', label: 'COP (Peso Colombiano)' },
    { code: 'MXN', symbol: '$', label: 'MXN (Peso Mexicano)' },
    { code: 'BRL', symbol: 'R$', label: 'BRL (Real Brasileño)' },
    { code: 'CAD', symbol: '$', label: 'CAD (Canadian Dollar)' },
    { code: 'AUD', symbol: '$', label: 'AUD (Australian Dollar)' },
    { code: 'CNY', symbol: '¥', label: 'CNY (Chinese Yuan)' },
    { code: 'INR', symbol: '₹', label: 'INR (Indian Rupee)' },
  ];

  useEffect(() => {
    const detectCurrency = async () => {
      try {
        // Use a free geolocation API
        const response = await fetch('https://ipapi.co/json/');
        
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        const currencyCode = data.currency || 'USD';
        
        // Find the currency in our options list
        const detectedOption = currencyOptions.find(c => c.code === currencyCode) || currencyOptions[0];
        setDetectedCurrency(detectedOption);
        setIsLoading(false);
      } catch (error) {
        console.error('Error detecting currency:', error);
        setError('Could not detect currency. Using default USD.');
        setIsLoading(false);
      }
    };

    // Try to load from localStorage first for faster initial render
    const storedCurrency = localStorage.getItem('detectedCurrency');
    if (storedCurrency) {
      try {
        setDetectedCurrency(JSON.parse(storedCurrency));
        setIsLoading(false);
      } catch (e) {
        // If parsing fails, fetch fresh data
        detectCurrency();
      }
    } else {
      detectCurrency();
    }
  }, []);

  return {
    detectedCurrency,
    currencyOptions,
    isLoading,
    error
  };
}
