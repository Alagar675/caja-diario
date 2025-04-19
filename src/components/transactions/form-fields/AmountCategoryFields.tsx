
import React from "react";
import { Label } from "@/components/ui/label";
import { EnhancedCurrencyInput } from "@/components/ui/enhanced-currency-input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

interface AmountCategoryFieldsProps {
  type: TransactionType;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (category: string) => void;
  setCurrencyCode?: (code: string) => void;
}

const AmountCategoryFields: React.FC<AmountCategoryFieldsProps> = ({
  type,
  amount,
  setAmount,
  category,
  setCategory,
  setCurrencyCode
}) => {
  // Income and expense categories
  const incomeCategories = [
    "Ventas en efectivo", 
    "Ventas a crédito", 
    "Recaudo Créditos", 
    "Recaudos recurrentes", 
    "Otros"
  ];
  
  const expenseCategories = [
    "Pago de Facturas",
    "Pagos recurrentes",
    "Servicios públicos",
    "Pago salarios",
    "Otros"
  ];
  
  const categories = type === "income" ? incomeCategories : expenseCategories;
  const label = type === "income" ? "Valor del ingreso" : "Valor del egreso";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <EnhancedCurrencyInput
          value=""
          onChange={setAmount}
          onCurrencyChange={setCurrencyCode}
          label={label}
          showFeedback={true}
          required
          autoFocus
          placeholder=""
          showConversion={false}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
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
};

export default AmountCategoryFields;
