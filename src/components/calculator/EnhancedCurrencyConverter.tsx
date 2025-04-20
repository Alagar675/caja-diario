
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TransactionCurrencyInput } from "@/components/transactions/form-fields/currency/TransactionCurrencyInput";
import { parseCurrencyValue } from "@/utils/currency/currencyUtils";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { CurrencyConverterTabs } from "./components/CurrencyConverterTabs";
import { CurrencySelectionGrid } from "./components/CurrencySelectionGrid";
import { ConversionResult } from "./components/ConversionResult";

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

interface EnhancedCurrencyConverterProps {
  isVisible?: boolean;
}

const EnhancedCurrencyConverter: React.FC<EnhancedCurrencyConverterProps> = ({ isVisible = true }) => {
  const localeInfo = useGeoLocaleDetection();
  const { convertValue, rates, loading, error } = useCurrencyConversion();
  
  const [amount, setAmount] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [convertedResult, setConvertedResult] = useState<number | null>(null);
  const [mostUsedCurrencies, setMostUsedCurrencies] = useState<string[]>([]);
  
  useEffect(() => {
    if (!localeInfo.loading) {
      setSourceCurrency(localeInfo.currencyCode);
      setTargetCurrency(localeInfo.currencyCode === "USD" ? "EUR" : "USD");
    }
  }, [localeInfo.loading, localeInfo.currencyCode]);
  
  useEffect(() => {
    const baseCurrencies = ["USD", "EUR", "GBP", "JPY"];
    if (!baseCurrencies.includes(localeInfo.currencyCode) && localeInfo.currencyCode) {
      baseCurrencies.unshift(localeInfo.currencyCode);
    }
    setMostUsedCurrencies(baseCurrencies);
  }, [localeInfo.currencyCode]);
  
  useEffect(() => {
    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      if (sourceCurrency && targetCurrency) {
        window.location.reload();
      }
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(refreshInterval);
  }, [sourceCurrency, targetCurrency]);
  
  const handleSwapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    setConvertedResult(null);
  };
  
  const handleConvert = () => {
    if (!amount || !sourceCurrency || !targetCurrency) return;
    const numericAmount = parseCurrencyValue(amount);
    const result = convertValue(numericAmount, sourceCurrency, targetCurrency);
    // Round to integer
    setConvertedResult(Math.floor(result));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };
  
  if (!isVisible) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-center text-lg">Convertidor de Monedas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="py-10 flex justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-red-500">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Usando tasas de cambio aproximadas</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <TransactionCurrencyInput
                amount={amount}
                setAmount={handleAmountChange}
                label="Valor a convertir"
              />
            </div>
            
            <CurrencySelectionGrid
              sourceCurrency={sourceCurrency}
              targetCurrency={targetCurrency}
              setSourceCurrency={setSourceCurrency}
              setTargetCurrency={setTargetCurrency}
              handleSwapCurrencies={handleSwapCurrencies}
              mostUsedCurrencies={mostUsedCurrencies}
            />
            
            <div className="pt-2">
              <Button 
                type="button" 
                onClick={handleConvert} 
                className="w-full"
                disabled={!amount || !sourceCurrency || !targetCurrency}
              >
                Convertir <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <ConversionResult
              amount={amount}
              convertedResult={convertedResult}
              sourceCurrency={sourceCurrency}
              targetCurrency={targetCurrency}
              rates={rates}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCurrencyConverter;
