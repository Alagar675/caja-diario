
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, ArrowRightLeft } from "lucide-react";
import { CurrencyInputField } from "@/components/ui/currency-input-field";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { parseCurrencyValue } from "@/utils/currency/currencyUtils";
import { getCurrencyDisplayInfo } from "@/utils/currency/currencyUtils";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { currencyMap } from "@/utils/currency/currencyHelpers";

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
      
      // Set a different target currency
      if (localeInfo.currencyCode === "USD") {
        setTargetCurrency("EUR");
      } else {
        setTargetCurrency("USD");
      }
    }
  }, [localeInfo.loading, localeInfo.currencyCode]);
  
  useEffect(() => {
    // Set most used currencies based on current selection
    const baseCurrencies = ["USD", "EUR", "GBP", "JPY"];
    const localCurrency = localeInfo.currencyCode;
    
    // Add local currency if it's not already in the list
    if (!baseCurrencies.includes(localCurrency) && localCurrency) {
      baseCurrencies.unshift(localCurrency);
    }
    
    setMostUsedCurrencies(baseCurrencies);
  }, [localeInfo.currencyCode]);
  
  const handleSwapCurrencies = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    setConvertedResult(null);
  };
  
  const handleConvert = () => {
    if (!amount || !sourceCurrency || !targetCurrency) return;
    
    const numericAmount = parseCurrencyValue(amount);
    const result = convertValue(numericAmount, sourceCurrency, targetCurrency);
    setConvertedResult(result);
  };
  
  const sourceSymbol = sourceCurrency ? getCurrencyDisplayInfo(sourceCurrency).symbol : "";
  const targetSymbol = targetCurrency ? getCurrencyDisplayInfo(targetCurrency).symbol : "";
  
  if (!isVisible) {
    return null;
  }
  
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
              <Label htmlFor="amount">Cantidad</Label>
              <CurrencyInputField
                id="amount"
                value={amount}
                onChange={setAmount}
                currencySymbol={sourceSymbol}
                className="w-full"
                placeholder="0,00"
              />
            </div>
            
            <div className="grid grid-cols-5 gap-2 items-center">
              <div className="col-span-2">
                <Label htmlFor="sourceCurrency" className="mb-1 block">De</Label>
                <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                  <SelectTrigger id="sourceCurrency">
                    <SelectValue placeholder="Moneda origen" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="font-medium text-xs text-gray-500 px-2 pb-1">Más usadas</div>
                    {mostUsedCurrencies.map(code => (
                      <SelectItem key={`source-${code}`} value={code}>
                        {code} - {currencyMap[code]?.name || code}
                      </SelectItem>
                    ))}
                    
                    <Separator className="my-1" />
                    <div className="font-medium text-xs text-gray-500 px-2 pb-1">Todas las monedas</div>
                    
                    {Object.keys(currencyMap).sort().map(code => (
                      <SelectItem key={`source-all-${code}`} value={code}>
                        {code} - {currencyMap[code].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1 flex justify-center">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={handleSwapCurrencies}
                  className="rounded-full h-8 w-8"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="targetCurrency" className="mb-1 block">A</Label>
                <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                  <SelectTrigger id="targetCurrency">
                    <SelectValue placeholder="Moneda destino" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="font-medium text-xs text-gray-500 px-2 pb-1">Más usadas</div>
                    {mostUsedCurrencies.map(code => (
                      <SelectItem key={`target-${code}`} value={code}>
                        {code} - {currencyMap[code]?.name || code}
                      </SelectItem>
                    ))}
                    
                    <Separator className="my-1" />
                    <div className="font-medium text-xs text-gray-500 px-2 pb-1">Todas las monedas</div>
                    
                    {Object.keys(currencyMap).sort().map(code => (
                      <SelectItem key={`target-all-${code}`} value={code}>
                        {code} - {currencyMap[code].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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
            
            {convertedResult !== null && (
              <div className="mt-4 pt-4 border-t text-center">
                <div className="flex items-center justify-center gap-x-2">
                  <CurrencyDisplay 
                    value={parseCurrencyValue(amount)} 
                    currencyCode={sourceCurrency}
                    size="md" 
                    showSymbol={true}
                  />
                  <span className="text-gray-500">=</span>
                  <CurrencyDisplay 
                    value={convertedResult} 
                    currencyCode={targetCurrency}
                    size="lg" 
                    variant="positive" 
                    showSymbol={true}
                  />
                </div>
                {rates[targetCurrency] && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tasa: 1 {sourceCurrency} = {rates[targetCurrency].toFixed(4)} {targetCurrency}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCurrencyConverter;
