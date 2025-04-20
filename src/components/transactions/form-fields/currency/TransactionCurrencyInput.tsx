
import React from "react";
import { EnhancedCurrencyInput } from "@/components/ui/enhanced-currency-input";

interface TransactionCurrencyInputProps {
  amount: string;
  setAmount: (value: string) => void;
  label: string;
  setCurrencyCode?: (code: string) => void;
  hideDecimals?: boolean;
}

export const TransactionCurrencyInput: React.FC<TransactionCurrencyInputProps> = ({
  amount,
  setAmount,
  label,
  setCurrencyCode,
  hideDecimals
}) => {
  return (
    <EnhancedCurrencyInput
      value={amount}
      onChange={setAmount}
      onCurrencyChange={setCurrencyCode}
      label={label}
      showFeedback={false}
      required
      autoFocus
      placeholder=""
      showConversion={false}
      hideDecimals={hideDecimals}
      className="text-right"
    />
  );
};
