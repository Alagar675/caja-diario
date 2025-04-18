
import { useState, useEffect } from "react";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";

interface ConversionRates {
  [key: string]: number;
}

interface ConversionResult {
  loading: boolean;
  error: string | null;
  convertValue: (amount: number, fromCurrency: string, toCurrency: string) => number;
  rates: ConversionRates;
}

/**
 * Hook to handle currency conversion between different currencies
 */
export function useCurrencyConversion(): ConversionResult {
  const [rates, setRates] = useState<ConversionRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currencyCode: baseCurrency } = useGeoLocaleDetection();
  
  useEffect(() => {
    const fetchRates = async () => {
      if (!baseCurrency) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Using a free exchange rate API
        const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
        
        if (!response.ok) {
          throw new Error("No se pudieron obtener las tasas de cambio");
        }
        
        const data = await response.json();
        if (data.rates) {
          setRates(data.rates);
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError("No se pudieron obtener las tasas de cambio");
        
        // Fallback to some common rates to allow the app to function
        setRates({
          USD: 1,
          EUR: 0.92,
          COP: 3900,
          MXN: 17.5,
          BRL: 5.3,
          GBP: 0.79
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRates();
    
    // Refresh rates every hour
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [baseCurrency]);
  
  const convertValue = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    if (!rates[fromCurrency] || !rates[toCurrency]) return amount;
    
    // Convert via USD as base
    const amountInBase = amount / rates[fromCurrency];
    return amountInBase * rates[toCurrency];
  };
  
  return {
    loading,
    error,
    convertValue,
    rates
  };
}
