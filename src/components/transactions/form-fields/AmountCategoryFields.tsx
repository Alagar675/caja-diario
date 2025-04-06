
import React from "react";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/finance";
import { useCurrencyLocale } from "@/hooks/useCurrencyLocale";

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
  
  // Use the currency locale hook
  const { currencySymbol } = useCurrencyLocale();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm font-medium">
          {type === "income" ? "Monto de ingreso" : "Monto de egreso"}
        </Label>
        <CurrencyInput
          id="amount"
          value={amount}
          onChange={setAmount}
          currencySymbol={currencySymbol}
          required
          maxDigits={30}
        />
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

export default AmountCategoryFields;
