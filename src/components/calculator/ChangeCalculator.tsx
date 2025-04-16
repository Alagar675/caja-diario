
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/ui/currency-input";
import { formatCurrency, formatCurrencyValue, parseCurrencyValue } from "@/utils/formatters";
import { useCurrencyLocale } from "@/hooks/useCurrencyLocale";

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

  const localeInfo = useCurrencyLocale();
  
  useEffect(() => {
    calculateChange();
  }, [amountToPay, amountReceived]);

  const calculateChange = () => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  };

  const handleAmountToPayChange = (value: string) => {
    setFormattedAmountToPay(value);
    setAmountToPay(parseCurrencyValue(value));
  };

  const handleAmountReceivedChange = (value: string) => {
    setFormattedAmountReceived(value);
    setAmountReceived(parseCurrencyValue(value));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700 text-xl">
          Calculadora de Cambio
          {localeInfo && (
            <div className="text-xs font-normal text-gray-600 mt-1">
              {localeInfo.currencyCode}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="amountToPay">Valor a pagar</Label>
          <CurrencyInput 
            id="amountToPay" 
            value={formattedAmountToPay} 
            onChange={handleAmountToPayChange}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountReceived">Dinero recibido</Label>
          <CurrencyInput 
            id="amountReceived" 
            value={formattedAmountReceived} 
            onChange={handleAmountReceivedChange}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="change">Cambio</Label>
          <div id="change" className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-mono font-medium text-lg tracking-wide" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(change)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeCalculator;
