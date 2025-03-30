
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

const ChangeCalculator = () => {
  const [amountToPay, setAmountToPay] = useState<number>(0);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [change, setChange] = useState<number>(0);

  useEffect(() => {
    const calculatedChange = amountReceived - amountToPay;
    setChange(calculatedChange >= 0 ? calculatedChange : 0);
  }, [amountToPay, amountReceived]);

  const handleAmountToPayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountToPay(value);
  };

  const handleAmountReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmountReceived(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-center text-blue-700">Calculadora de Cambio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="amountToPay">Monto a pagar</Label>
          <Input
            id="amountToPay"
            type="number"
            placeholder="0"
            min="0"
            value={amountToPay || ""}
            onChange={handleAmountToPayChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountReceived">Monto recibido</Label>
          <Input
            id="amountReceived"
            type="number"
            placeholder="0"
            min="0"
            value={amountReceived || ""}
            onChange={handleAmountReceivedChange}
            className="text-right"
          />
        </div>

        <div className="space-y-2 pt-2 border-t">
          <Label htmlFor="change">Cambio a devolver</Label>
          <div 
            id="change"
            className="h-10 flex items-center justify-end px-3 rounded-md bg-gray-100 font-medium text-lg"
          >
            {formatCurrency(change)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangeCalculator;
