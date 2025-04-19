
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

interface CategorySelectorProps {
  type: TransactionType;
  category: string;
  setCategory: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  type,
  category,
  setCategory
}) => {
  const categories = type === "income" 
    ? [
        "Ventas en efectivo", 
        "Ventas a crédito", 
        "Recaudo Créditos", 
        "Recaudos recurrentes", 
        "Otros"
      ]
    : [
        "Pago de Facturas",
        "Pagos recurrentes",
        "Servicios públicos",
        "Pago salarios",
        "Otros"
      ];

  return (
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
  );
};
