
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import { Transaction, TransactionType, DailySummary, PaymentMethod, Withdrawal } from "@/types/finance";
import { 
  filterTransactionsByDate, 
  calculateDailySummary, 
  calculateTotalBalance,
  getCategorySummaryByType,
  calculateBalanceSummary
} from "@/utils/financeUtils";

interface FinanceContextType {
  transactions: Transaction[];
  withdrawals: Withdrawal[];
  addTransaction: (transaction: Omit<Transaction, "id" | "userId" | "createdAt">) => void;
  addWithdrawal: (withdrawal: Omit<Withdrawal, "id" | "userId" | "timestamp">) => void;
  getTransactionsByDate: (startDate: Date, endDate: Date) => Transaction[];
  getDailySummary: (date?: Date) => DailySummary;
  getTotalBalance: () => number;
  getCategorySummary: (type: TransactionType) => { category: string; total: number }[];
  generateDayEndReport: () => DailySummary;
  getBalanceSummary: () => { cashBalance: number; transferBalance: number; creditBalance: number };
  getTotalWithdrawals: () => { cashWithdrawals: number; transferWithdrawals: number; creditWithdrawals: number; totalWithdrawals: number };
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

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

      const storedWithdrawals = localStorage.getItem(`withdrawals-${user.id}`);
      if (storedWithdrawals) {
        try {
          const parsedWithdrawals = JSON.parse(storedWithdrawals).map((w: any) => ({
            ...w,
            timestamp: new Date(w.timestamp)
          }));
          setWithdrawals(parsedWithdrawals);
        } catch (error) {
          console.error("Failed to parse stored withdrawals:", error);
          localStorage.removeItem(`withdrawals-${user.id}`);
        }
      }
    } else {
      setTransactions([]);
      setWithdrawals([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`transactions-${user.id}`, JSON.stringify(transactions));
    }
  }, [transactions, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`withdrawals-${user.id}`, JSON.stringify(withdrawals));
    }
  }, [withdrawals, user]);

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

  const addWithdrawal = (withdrawal: Omit<Withdrawal, "id" | "userId" | "timestamp">) => {
    if (!user) {
      toast.error("Debe iniciar sesión para registrar retiros");
      return;
    }

    // Create transaction for accounting purposes
    const transactionType: TransactionType = "expense";
    const newTransaction: Transaction = {
      type: transactionType,
      amount: withdrawal.amount,
      category: "Retiro de fondos",
      description: `Retiro de ${withdrawal.source} - ${withdrawal.concept}`,
      paymentMethod: withdrawal.source === "cash" ? "cash" : "transfer",
      date: new Date(),
      userId: user.id,
      id: `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    // Create withdrawal record
    const newWithdrawal: Withdrawal = {
      ...withdrawal,
      id: `withdrawal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      timestamp: new Date()
    };

    setTransactions(prev => [...prev, newTransaction]);
    setWithdrawals(prev => [...prev, newWithdrawal]);
    
    toast.success(`Retiro de ${withdrawal.source} registrado correctamente`);
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

  const getTotalWithdrawals = () => {
    if (!user) {
      return {
        cashWithdrawals: 0,
        transferWithdrawals: 0,
        creditWithdrawals: 0,
        totalWithdrawals: 0
      };
    }

    const userWithdrawals = withdrawals.filter(w => w.userId === user.id);
    
    const cashWithdrawals = userWithdrawals
      .filter(w => w.source === "cash")
      .reduce((total, w) => total + w.amount, 0);
      
    const transferWithdrawals = userWithdrawals
      .filter(w => w.source === "transfer")
      .reduce((total, w) => total + w.amount, 0);
      
    const creditWithdrawals = userWithdrawals
      .filter(w => w.source === "credit")
      .reduce((total, w) => total + w.amount, 0);
    
    return {
      cashWithdrawals,
      transferWithdrawals,
      creditWithdrawals,
      totalWithdrawals: cashWithdrawals + transferWithdrawals + creditWithdrawals
    };
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        withdrawals,
        addTransaction,
        addWithdrawal,
        getTransactionsByDate,
        getDailySummary,
        getTotalBalance,
        getCategorySummary,
        generateDayEndReport,
        getBalanceSummary,
        getTotalWithdrawals
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export type { Transaction, TransactionType, PaymentMethod, DailySummary, Withdrawal };
