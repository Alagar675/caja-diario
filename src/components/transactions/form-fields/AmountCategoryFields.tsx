
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/finance";
import { formatCurrencyValue, parseCurrencyValue } from "@/utils/formatters";

interface AmountCategoryFieldsProps {
  type: TransactionType;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

export function AmountCategoryFields({
  type,
  amount,
  setAmount,
  category,
  setCategory,
}: AmountCategoryFieldsProps) {
  const incomeCategories = ["Ventas", "Servicios", "Inversiones", "Préstamos", "Otros"];
  const expenseCategories = ["Compras", "Servicios", "Impuestos", "Nómina", "Alquiler", "Suministros", "Transporte", "Otros"];
  const categories = type === "income" ? incomeCategories : expenseCategories;

  // Handle amount change with automatic formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setAmount('');
      return;
    }

    // Limit to 20 digits (excluding periods and commas)
    const digitCount = rawValue.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseCurrencyValue(rawValue);
    setAmount(formatCurrencyValue(numericValue));
  };

  const handleAmountFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          {type === "income" ? "Monto de ingreso" : "Monto de egreso"}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <Input
            id="amount"
            type="text"
            placeholder="0,00"
            value={amount}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            className="pl-7 text-right"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Categoría
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Make sure to export the component as default as well
export default AmountCategoryFields;
