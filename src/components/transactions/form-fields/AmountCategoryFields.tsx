
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

interface AmountCategoryFieldsProps {
  type: TransactionType;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const AmountCategoryFields = ({
  type,
  amount,
  setAmount,
  category,
  setCategory
}: AmountCategoryFieldsProps) => {
  const categoryOptions = type === "income" 
    ? ["Ventas en efectivo", "Ventas a crédito", "Recaudo Créditos", "Recaudos recurrentes", "Otros"] 
    : ["Pago de Facturas", "Pagos recurrentes", "Servicios públicos", "Pago salarios", "Otros"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Monto</Label>
        <Input 
          id="amount" 
          type="number" 
          placeholder="0" 
          required 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          className="transition-all duration-200" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select required value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Elegir categoría" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AmountCategoryFields;
