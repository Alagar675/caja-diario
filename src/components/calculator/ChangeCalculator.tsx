
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

  const [formattedAmountToPay, setFormattedAmountToPay] = useState<string>("");
  const [formattedAmountReceived, setFormattedAmountReceived] = useState<string>("");

  useEffect(() => {
    calculateChange();
  }, [amountToPay, amountReceived]);

  const calculateChange = () => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  };

  const formatNumber = (value: number): string => {
    // Formatea el número con punto para miles y coma para decimales
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseFormattedNumber = (formattedValue: string): number => {
    if (!formattedValue.trim()) return 0;

    // Elimina todos los caracteres que no sean dígitos, puntos o comas
    // Luego reemplaza los puntos (separadores de miles) y convierte comas a puntos para el parsing
    const numericString = formattedValue
      .replace(/[^\d,.]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');

    return parseFloat(numericString) || 0;
  };

  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setFormattedAmountToPay('');
      setAmountToPay(0);
      return;
    }

    // Limita a 20 dígitos (excluyendo puntos y comas)
    const digitCount = rawValue.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseFormattedNumber(rawValue);
    setAmountToPay(numericValue);
    setFormattedAmountToPay(formatNumber(numericValue));
  };

  const handleAmountReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setFormattedAmountReceived('');
      setAmountReceived(0);
      return;
    }

    // Limita a 20 dígitos (excluyendo puntos y comas)
    const digitCount = rawValue.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseFormattedNumber(rawValue);
    setAmountReceived(numericValue);
    setFormattedAmountReceived(formatNumber(numericValue));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

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
        <Input id="amountToPay" type="text" placeholder="0,00" value={formattedAmountToPay} onChange={handleAmountToPayChange} onFocus={handleFocus} className="text-right" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amountReceived">Dinero recibido</Label>
        <Input id="amountReceived" type="text" placeholder="0,00" value={formattedAmountReceived} onChange={handleAmountReceivedChange} onFocus={handleFocus} className="text-right" />
      </div>

      <div className="space-y-2 pt-2 border-t">
        <Label htmlFor="change">Cambio</Label>
        <div id="change" className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-medium text-lg">
          {formatCurrency(change)}
        </div>
      </div>
    </CardContent>
  </Card>;
};

export default ChangeCalculator;
