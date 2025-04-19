
import React from "react";
import { EnhancedCurrencyInput } from "@/components/ui/enhanced-currency-input";

interface TransactionCurrencyInputProps {
  amount: string;
  setAmount: (value: string) => void;
  label: string;
  setCurrencyCode?: (code: string) => void;
}

export const TransactionCurrencyInput: React.FC<TransactionCurrencyInputProps> = ({
  amount,
  setAmount,
  label,
  setCurrencyCode
}) => {
  return (
    <EnhancedCurrencyInput
      value={amount}
      onChange={setAmount}
      onCurrencyChange={setCurrencyCode}
      label={label}
      showFeedback={true}
      required
      autoFocus
      placeholder=""
      showConversion={false}
      className="text-right"
    />
  );
};

