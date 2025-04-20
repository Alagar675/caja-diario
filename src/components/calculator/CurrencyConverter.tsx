import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import { useCurrencyConverter } from "@/hooks/useCurrencyConverter";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { parseCurrencyValue } from "@/utils/currency/currencyFormatter";
import { currencyMap } from "@/utils/currency/currencyHelpers";
import { Button } from "@/components/ui/button";
import { TransactionCurrencyInput } from "@/components/transactions/form-fields/currency/TransactionCurrencyInput";

const CurrencyConverter = () => {
  const localeInfo = useGeoLocaleDetection();
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<string>("0");
  
  const { rates, loading, error, convert } = useCurrencyConverter(localeInfo.currencyCode);
  
  useEffect(() => {
    if (!localeInfo.loading && !fromCurrency) {
      setFromCurrency(localeInfo.currencyCode);
    }
  }, [localeInfo.loading, localeInfo.currencyCode, fromCurrency]);

  useEffect(() => {
    if (fromCurrency && toCurrency && !loading) {
      const numericAmount = parseCurrencyValue(amount);
      const result = convert(numericAmount, fromCurrency, toCurrency);
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, rates, loading, convert]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
  };

  const handleRefreshRates = () => {
    window.location.reload();
  };
  
  const currencies = Object.keys(currencyMap).map(code => ({
    value: code,
    label: `${code} - ${currencyMap[code].name}`
  }));

  return (
    <Card className="w-full mt-4">
      <CardHeader className="bg-green-50 border-b">
        <CardTitle className="text-center text-green-700 text-lg">
          Conversor de Divisas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <TransactionCurrencyInput
            amount={amount}
            setAmount={handleInputChange}
            label="Cantidad"
          />
        </div>
        
        <div className="grid grid-cols-5 gap-2 items-end">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="fromCurrency">De</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSwapCurrencies}
              className="h-10 w-10"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="col-span-2 space-y-2">
            <Label htmlFor="toCurrency">A</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label>Resultado</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefreshRates}
              className="h-8 px-2 text-xs"
              disabled={loading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Actualizar
            </Button>
          </div>
          <div className="h-10 flex items-center justify-end px-3 mt-1 rounded-md bg-gray-100 font-mono font-medium text-lg text-right">
            {loading ? (
              <span className="text-sm text-gray-500">Cargando...</span>
            ) : error ? (
              <span className="text-sm text-red-500">{error}</span>
            ) : (
              <span className="w-full text-right">{convertedAmount} {toCurrency}</span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Tasas de cambio en tiempo real | Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
