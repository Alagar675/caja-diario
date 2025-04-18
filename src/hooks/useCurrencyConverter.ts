
import { useState, useEffect } from "react";
import { getExchangeRates } from "@/services/currencyConversionService";

interface CurrencyConverterResult {
  rates: Record<string, number>;
  loading: boolean;
  error: string | null;
  convert: (amount: number, fromCurrency: string, toCurrency: string) => number;
}

export function useCurrencyConverter(baseCurrency: string): CurrencyConverterResult {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const exchangeRates = await getExchangeRates(baseCurrency);
        setRates(exchangeRates);
      } catch (err) {
        setError("No fue posible obtener las tasas de cambio");
        console.error("Error fetching exchange rates:", err);
      } finally {
        setLoading(false);
      }
    };

    if (baseCurrency) {
      fetchRates();
    }
  }, [baseCurrency]);

  const convert = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount;
    if (!rates || Object.keys(rates).length === 0) return 0;

    if (fromCurrency === baseCurrency) {
      return amount * (rates[toCurrency] || 0);
    } else if (toCurrency === baseCurrency) {
      return amount / (rates[fromCurrency] || 1);
    } else {
      // Convertir a través de la moneda base
      const amountInBase = amount / (rates[fromCurrency] || 1);
      return amountInBase * (rates[toCurrency] || 0);
    }
  };

  return { rates, loading, error, convert };
}

export default useCurrencyConverter;
