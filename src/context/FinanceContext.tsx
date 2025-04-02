import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Transaction, TransactionType, DailySummary, PaymentMethod } from "@/types/finance";
import { 
  filterTransactionsByDate, 
  calculateDailySummary, 
  calculateTotalBalance,
  getCategorySummaryByType,
  calculateBalanceSummary
} from "@/utils/financeUtils";

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => void;
  getTransactionsByDate: (startDate: Date, endDate: Date) => Transaction[];
  getDailySummary: (date?: Date) => DailySummary;
  getTotalBalance: () => number;
  getCategorySummary: (type: TransactionType) => { category: string; total: number }[];
  generateDayEndReport: () => DailySummary;
  getBalanceSummary: () => { cashBalance: number; transferBalance: number; creditBalance: number };
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider = ({ children }: FinanceProviderProps) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      const storedTransactions = localStorage.getItem(`transactions-${user.id}`);
      if (storedTransactions) {
        try {
          const parsedTransactions = JSON.parse(storedTransactions).map((t: any) => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt)
          }));
          setTransactions(parsedTransactions);
        } catch (error) {
          console.error("Failed to parse stored transactions:", error);
          localStorage.removeItem(`transactions-${user.id}`);
        }
      }
    } else {
      setTransactions([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions-${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  const addTransaction = (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => {
    if (!user) {
      toast.error("Debe iniciar sesión para registrar transacciones");
      return;
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      createdAt: new Date()
    };

    setTransactions((prev) => [...prev, newTransaction]);
    
    toast.success(
      transaction.type === "income" 
        ? "Ingreso registrado correctamente" 
        : "Egreso registrado correctamente"
    );
  };

  const getTransactionsByDate = (startDate: Date, endDate: Date) => {
    if (!user) return [];
    return filterTransactionsByDate(transactions, startDate, endDate, user.id);
  };

  const getDailySummary = (date = new Date()): DailySummary => {
    return calculateDailySummary(transactions, user?.id, date);
  };

  const getTotalBalance = () => {
    return calculateTotalBalance(transactions, user?.id);
  };

  const getCategorySummary = (type: TransactionType) => {
    return getCategorySummaryByType(transactions, user?.id, type);
  };

  const generateDayEndReport = () => {
    const summary = getDailySummary();
    return summary;
  };

  const getBalanceSummary = () => {
    return calculateBalanceSummary(transactions, user?.id);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactionsByDate,
        getDailySummary,
        getTotalBalance,
        getCategorySummary,
        generateDayEndReport,
        getBalanceSummary
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export type { Transaction, TransactionType, PaymentMethod, DailySummary };
