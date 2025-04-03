
import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { FinanceContextType } from "@/types/finance";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { useWithdrawalOperations } from "@/hooks/useWithdrawalOperations";

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider = ({ children }: FinanceProviderProps) => {
  const { user } = useAuth();
  const { transactions, withdrawals, addTransaction, addWithdrawal } = useFinanceData(user);
  const transactionOps = useTransactionOperations(transactions, user?.id);
  const withdrawalOps = useWithdrawalOperations(withdrawals, user?.id);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        withdrawals,
        addTransaction,
        addWithdrawal,
        ...transactionOps,
        ...withdrawalOps
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export { Transaction, TransactionType, PaymentMethod, DailySummary, Withdrawal } from "@/types/finance";
