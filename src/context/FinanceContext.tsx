
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

export type TransactionType = "income" | "expense";
export type PaymentMethod = "cash" | "transfer";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  bankName?: string;
  transferNumber?: string;
  recipientName?: string;
  recipientId?: string;
  date: Date;
  createdAt: Date;
}

export interface DailySummary {
  date: string;
  totalIncomeCash: number;
  totalIncomeTransfer: number;
  totalExpenseCash: number;
  totalExpenseTransfer: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => void;
  getTransactionsByDate: (startDate: Date, endDate: Date) => Transaction[];
  getDailySummary: (date?: Date) => DailySummary;
  getTotalBalance: () => number;
  getCategorySummary: (type: TransactionType) => { category: string; total: number }[];
  generateDayEndReport: () => DailySummary;
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
      // Load transactions from localStorage for the current user
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

  // Save transactions to localStorage whenever they change
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
    
    return transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return t.userId === user.id && 
        transactionDate >= startDate && 
        transactionDate <= endDate;
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  const getDailySummary = (date = new Date()): DailySummary => {
    if (!user) {
      return {
        date: date.toISOString().split('T')[0],
        totalIncomeCash: 0,
        totalIncomeTransfer: 0,
        totalExpenseCash: 0,
        totalExpenseTransfer: 0,
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      };
    }

    const dayTransactions = transactions.filter(
      t => t.userId === user.id && isSameDay(new Date(t.date), date)
    );

    let totalIncomeCash = 0;
    let totalIncomeTransfer = 0;
    let totalExpenseCash = 0;
    let totalExpenseTransfer = 0;

    dayTransactions.forEach(t => {
      if (t.type === "income") {
        if (t.paymentMethod === "cash") {
          totalIncomeCash += t.amount;
        } else {
          totalIncomeTransfer += t.amount;
        }
      } else {
        if (t.paymentMethod === "cash") {
          totalExpenseCash += t.amount;
        } else {
          totalExpenseTransfer += t.amount;
        }
      }
    });

    const totalIncome = totalIncomeCash + totalIncomeTransfer;
    const totalExpense = totalExpenseCash + totalExpenseTransfer;

    return {
      date: date.toISOString().split('T')[0],
      totalIncomeCash,
      totalIncomeTransfer,
      totalExpenseCash,
      totalExpenseTransfer,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  };

  const getTotalBalance = () => {
    if (!user) return 0;
    
    return transactions
      .filter(t => t.userId === user.id)
      .reduce((acc, t) => {
        return t.type === "income" 
          ? acc + t.amount 
          : acc - t.amount;
      }, 0);
  };

  const getCategorySummary = (type: TransactionType) => {
    if (!user) return [];
    
    const filteredTransactions = transactions.filter(
      t => t.userId === user.id && t.type === type
    );

    const categories: Record<string, number> = {};
    
    filteredTransactions.forEach(t => {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += t.amount;
    });

    return Object.entries(categories).map(([category, total]) => ({
      category,
      total
    }));
  };

  const generateDayEndReport = () => {
    const summary = getDailySummary();
    
    // In a real app, we might want to save this report somewhere
    return summary;
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
        generateDayEndReport
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
