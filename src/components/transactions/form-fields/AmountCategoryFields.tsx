
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@/types/finance";
import { GeoLocalizedCurrencyInput } from "@/components/ui/geo-localized-currency-input";

interface AmountCategoryFieldsProps {
  type: TransactionType;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  setCurrencyCode?: (value: string) => void;
}

const incomeCategories = [
  "Ventas",
  "Servicios",
  "Transferencias",
  "Préstamos",
  "Inversiones",
  "Otros ingresos"
];

const expenseCategories = [
  "Compras",
  "Servicios",
  "Nómina",
  "Impuestos",
  "Alquiler",
  "Transporte",
  "Mantenimiento",
  "Otros gastos"
];

const AmountCategoryFields = ({ 
  type, 
  amount, 
  setAmount, 
  category, 
  setCategory,
  setCurrencyCode
}: AmountCategoryFieldsProps) => {
  const categories = type === "income" ? incomeCategories : expenseCategories;
  
  const handleCurrencyChange = (currencyCode: string) => {
    if (setCurrencyCode) {
      setCurrencyCode(currencyCode);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <GeoLocalizedCurrencyInput
          label="Valor"
          value={amount}
          onChange={setAmount}
          onCurrencyChange={handleCurrencyChange}
        />
      </div>
      
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Seleccione una categoría" />
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
