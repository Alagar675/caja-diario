
import React from "react";
import { TransactionType } from "@/types/finance";
import { TransactionCurrencyInput } from "./currency/TransactionCurrencyInput";
import { CategorySelector } from "./category/CategorySelector";

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
  const label = type === "income" ? "Valor del ingreso" : "Valor del egreso";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <TransactionCurrencyInput
          amount={amount}
          setAmount={setAmount}
          label={label}
          setCurrencyCode={setCurrencyCode}
        />
      </div>

      <CategorySelector
        type={type}
        category={category}
        setCategory={setCategory}
      />
    </div>
  );
};

export default AmountCategoryFields;

