
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { FinanceContextType, Transaction } from "@/types/finance";
import { useFinanceData } from "@/hooks/useFinanceData";
import { useTransactionOperations } from "@/hooks/useTransactionOperations";
import { useWithdrawalOperations } from "@/hooks/useWithdrawalOperations";
import { useCostCenterManagement } from "@/hooks/useCostCenterManagement";

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
  const { 
    transactions, 
    withdrawals, 
    archivedTransactions, 
    archivedWithdrawals,
    addTransaction: originalAddTransaction, 
    addWithdrawal,
    archiveCurrentData,
    resetBalancesForNewDay
  } = useFinanceData(user);
  
  const {
    costCenters,
    selectedCostCenter,
    addCostCenter,
    selectCostCenter
  } = useCostCenterManagement();
  
  const transactionOps = useTransactionOperations(transactions, user?.id);
  const withdrawalOps = useWithdrawalOperations(withdrawals, user?.id);
  
  // Sobrescribir addTransaction para incluir el centro de costos seleccionado
  const addTransaction = (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    const transactionWithCostCenter = selectedCostCenter 
      ? { ...transaction, costCenterId: selectedCostCenter.id } 
      : transaction;
    originalAddTransaction(transactionWithCostCenter);
  };
  
  // Función para obtener transacciones por centro de costos
  const getTransactionsByCostCenter = (costCenterId: string) => {
    return transactions.filter(t => t.costCenterId === costCenterId);
  };
  
  // Check for abnormal exit when component mounts
  useEffect(() => {
    const abnormalExit = localStorage.getItem("abnormalExit");
    
    if (abnormalExit === "true" || abnormalExit === null) {
      // Set flag that cash closure is needed
      localStorage.setItem("needsCashClose", "true");
      
      // Also set recovery needed flag to show recovery dialog
      localStorage.setItem("needsRecovery", "true");
    }
    
    // Always mark as abnormal exit until properly closed
    localStorage.setItem("abnormalExit", "true");
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        withdrawals,
        archivedTransactions,
        archivedWithdrawals,
        costCenters,
        selectedCostCenter,
        addTransaction,
        addWithdrawal,
        resetBalancesForNewDay,
        addCostCenter,
        selectCostCenter,
        getTransactionsByCostCenter,
        ...transactionOps,
        ...withdrawalOps
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export type { Transaction, TransactionType, PaymentMethod, DailySummary, Withdrawal, CostCenter } from "@/types/finance";
