

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeoLocalizedCurrencyInput } from "@/components/ui/geo-localized-currency-input";
import { formatCurrency, parseCurrencyValue } from "@/utils/currency/currencyFormatter";
import CurrencyConverter from "./CurrencyConverter";

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

  // Calculate change automatically when amounts change
  useEffect(() => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  }, [amountToPay, amountReceived]);

  const handleAmountToPayChange = (value: string) => {
    setFormattedAmountToPay(value);
    const numericValue = parseCurrencyValue(value);
    setAmountToPay(numericValue);
  };

  const handleAmountReceivedChange = (value: string) => {
    setFormattedAmountReceived(value);
    const numericValue = parseCurrencyValue(value);
    setAmountReceived(numericValue);
  };
  
  const handleCurrencyChange = (currency: string) => {
    setCurrencyCode(currency);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700 text-xl">
          Calculadora de Cambio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <GeoLocalizedCurrencyInput 
            label="Valor a pagar"
            value={formattedAmountToPay}
            onChange={handleAmountToPayChange}
            onCurrencyChange={handleCurrencyChange}
            placeholder=""
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <GeoLocalizedCurrencyInput
            label="Dinero recibido"
            value={formattedAmountReceived}
            onChange={handleAmountReceivedChange}
            onCurrencyChange={handleCurrencyChange}
            placeholder=""
            className="text-right"
          />
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div 
            className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 text-lg"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {change > 0 ? formatCurrency(change) : ""}
          </div>
        </div>
        
        <CurrencyConverter />
      </CardContent>
    </Card>
  );
};

export default ChangeCalculator;

