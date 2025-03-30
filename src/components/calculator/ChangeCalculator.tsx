import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";
interface ChangeCalculatorProps {
  isVisible?: boolean;
}
const ChangeCalculator = ({
  isVisible = true
}: ChangeCalculatorProps) => {
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [change, setChange] = useState<number>(0);

  // For display in the input fields
  const [formattedAmountToPay, setFormattedAmountToPay] = useState<string>("");
  const [formattedAmountReceived, setFormattedAmountReceived] = useState<string>("");

  // Update change calculation whenever input values change
  useEffect(() => {
    calculateChange();
  }, [amountToPay, amountReceived]);

  // Calculate the change amount
  const calculateChange = () => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  };

  // Helper function to format number with thousand separators
  const formatNumber = (value: number): string => {
    // Format with dots for thousands and comma for decimals (Colombian format)
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Helper function to parse formatted string back to number
  const parseFormattedNumber = (formattedValue: string): number => {
    // Handle empty strings
    if (!formattedValue.trim()) return 0;

    // Remove all non-numeric characters except decimal comma and thousand separators
    // Replace comma with dot for proper JavaScript float parsing
    const numericString = formattedValue.replace(/[^\d,.]/g, '').replace(/\./g, '') // Remove all dots (thousand separators)
    .replace(',', '.'); // Replace comma with dot for decimal parsing

    return parseFloat(numericString) || 0;
  };
  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Don't format empty input
    if (rawValue === '') {
      setFormattedAmountToPay('');
      setAmountToPay(0);
      return;
    }

    // Limit input length to 24 characters (20 digits + separators and decimals)
    if (rawValue.replace(/[^\d]/g, '').length > 20) {
      return;
    }

    // Remove non-numeric characters for calculation
    const numericValue = parseFormattedNumber(rawValue);
    setAmountToPay(numericValue);

    // Format for display
    setFormattedAmountToPay(formatNumber(numericValue));

    // Immediately calculate the change
    calculateChange();
  };
  const handleAmountReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Don't format empty input
    if (rawValue === '') {
      setFormattedAmountReceived('');
      setAmountReceived(0);
      return;
    }

    // Limit input length to 24 characters (20 digits + separators and decimals)
    if (rawValue.replace(/[^\d]/g, '').length > 20) {
      return;
    }

    // Remove non-numeric characters for calculation
    const numericValue = parseFormattedNumber(rawValue);
    setAmountReceived(numericValue);

    // Format for display
    setFormattedAmountReceived(formatNumber(numericValue));

    // Immediately calculate the change
    calculateChange();
  };

  // Handle focus to make editing easier and select all text
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // If the component is not visible, don't render anything
  if (!isVisible) {
    return null;
  }
  return <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700 text-xl">Calculadora de Cambio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="amountToPay">Valor a pagar</Label>
          <Input id="amountToPay" type="text" placeholder="0" value={formattedAmountToPay} onChange={handleAmountToPayChange} onFocus={handleFocus} className="text-right" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountReceived">Valor recibido</Label>
          <Input id="amountReceived" type="text" placeholder="0" value={formattedAmountReceived} onChange={handleAmountReceivedChange} onFocus={handleFocus} className="text-right" />
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="change">Valor a devolver</Label>
          <div id="change" className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-medium text-lg">
            {formatCurrency(change)}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ChangeCalculator;