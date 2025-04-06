
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyValue, parseCurrencyValue } from "@/utils/formatters";

interface ChangeCalculatorProps {
  isVisible?: boolean;
}

const ChangeCalculator = ({
  isVisible = true
}: ChangeCalculatorProps) => {
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [change, setChange] = useState<number>(0);

  const [formattedAmountToPay, setFormattedAmountToPay] = useState<string>("");
  const [formattedAmountReceived, setFormattedAmountReceived] = useState<string>("");

  // Get locale info from localStorage if available
  const [localeInfo, setLocaleInfo] = useState<any>(null);
  
  useEffect(() => {
    // Try to get stored locale info
    const storedLocale = localStorage.getItem('detectedLocale');
    if (storedLocale) {
      try {
        setLocaleInfo(JSON.parse(storedLocale));
      } catch (e) {
        console.error("Error parsing stored locale:", e);
      }
    }
  }, []);

  useEffect(() => {
    calculateChange();
  }, [amountToPay, amountReceived]);

  const calculateChange = () => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  };

  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setFormattedAmountToPay('');
      setAmountToPay(0);
      return;
    }

    // Limit to 20 digits total (excluding separators)
    const digitCount = rawValue.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseCurrencyValue(rawValue);
    setAmountToPay(numericValue);
    setFormattedAmountToPay(formatCurrencyValue(numericValue));
  };

  const handleAmountReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setFormattedAmountReceived('');
      setAmountReceived(0);
      return;
    }

    // Limit to 20 digits total (excluding separators)
    const digitCount = rawValue.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseCurrencyValue(rawValue);
    setAmountReceived(numericValue);
    setFormattedAmountReceived(formatCurrencyValue(numericValue));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  if (!isVisible) {
    return null;
  }

  // Get currency symbol based on detected locale
  const currencySymbol = localeInfo?.currencyCode === 'USD' ? '$' : 
                        localeInfo?.currencyCode === 'EUR' ? '€' : 
                        localeInfo?.currencyCode === 'GBP' ? '£' : '$';

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700 text-xl">
          Calculadora de Cambio
          {localeInfo && (
            <div className="text-xs font-normal text-gray-600 mt-1">
              {localeInfo.country} ({localeInfo.currencyCode})
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="amountToPay">Valor a pagar</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currencySymbol}
            </span>
            <Input 
              id="amountToPay" 
              type="text" 
              placeholder="0,00" 
              value={formattedAmountToPay} 
              onChange={handleAmountToPayChange} 
              onFocus={handleFocus} 
              className="pl-7 text-right" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountReceived">Dinero recibido</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {currencySymbol}
            </span>
            <Input 
              id="amountReceived" 
              type="text" 
              placeholder="0,00" 
              value={formattedAmountReceived} 
              onChange={handleAmountReceivedChange} 
              onFocus={handleFocus} 
              className="pl-7 text-right" 
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="change">Cambio</Label>
          <div id="change" className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-medium text-lg">
            {formatCurrency(change)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeCalculator;
