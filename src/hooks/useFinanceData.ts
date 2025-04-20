
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { Transaction, TransactionType, DailySummary, Withdrawal } from "@/types/finance";
import { 
  filterTransactionsByDate, 
  calculateDailySummary, 
  calculateTotalBalance,
  getCategorySummaryByType,
  calculateBalanceSummary
} from "@/utils/financeUtils";

export const useFinanceData = (user: User | null) => {
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

  return {
    transactions,
    withdrawals,
    addTransaction,
    addWithdrawal
  };
};
