
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { GeoLocalizedCurrencyInput } from "@/components/ui/geo-localized-currency-input";
import { formatCurrency, parseCurrencyValue } from "@/utils/formatters";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";

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
  const [currencyCode, setCurrencyCode] = useState<string>(""); 
  
  const localeInfo = useGeoLocaleDetection();
  
  // Set default currency code when locale is detected
  useEffect(() => {
    if (!localeInfo.loading && !currencyCode) {
      setCurrencyCode(localeInfo.currencyCode);
    }
  }, [localeInfo.loading, localeInfo.currencyCode, currencyCode]);

  // Calculate change automatically when amounts change
  useEffect(() => {
    calculateChange();
  }, [amountToPay, amountReceived]);

  const calculateChange = () => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  };

  const handleAmountToPayChange = (value: string) => {
    setFormattedAmountToPay(value);
    const parsedValue = parseCurrencyValue(value);
    setAmountToPay(parsedValue);
  };

  const handleAmountReceivedChange = (value: string) => {
    setFormattedAmountReceived(value);
    const parsedValue = parseCurrencyValue(value);
    setAmountReceived(parsedValue);
  };
  
  const handleCurrencyChange = (currency: string) => {
    setCurrencyCode(currency);
    // Update the global formatter settings when currency changes
    if (localeInfo.locale) {
      updateLocaleSettings(localeInfo.locale, currency);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700 text-xl">
          Calculadora de Cambio
          <div className="text-xs font-normal text-gray-600 mt-1">
            {localeInfo.currency} ({currencyCode || localeInfo.currencyCode})
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <GeoLocalizedCurrencyInput 
            label="Valor a pagar"
            value={formattedAmountToPay}
            onChange={handleAmountToPayChange}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        <div className="space-y-2">
          <GeoLocalizedCurrencyInput
            label="Dinero recibido"
            value={formattedAmountReceived}
            onChange={handleAmountReceivedChange}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="change">Cambio</Label>
          <div 
            id="change" 
            className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-mono font-medium text-lg tracking-wide"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatCurrency(change)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to update global locale settings
const updateLocaleSettings = (locale: string, currency: string) => {
  // Import from formatters.tsx
  const { updateLocaleSettings: updateSettings } = require('@/utils/formatters');
  updateSettings(locale, currency);
};

export default ChangeCalculator;
