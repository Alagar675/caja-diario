
import { Transaction, TransactionType, DailySummary } from "@/types/finance";

export const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

export const filterTransactionsByDate = (
  transactions: Transaction[], 
  startDate: Date, 
  endDate: Date,
  userId: string
): Transaction[] => {
  return transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return t.userId === userId && 
      transactionDate >= startDate && 
      transactionDate <= endDate;
  });
};

export const calculateDailySummary = (
  transactions: Transaction[],
  userId: string | undefined,
  date = new Date()
): DailySummary => {
  if (!userId) {
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
    t => t.userId === userId && isSameDay(new Date(t.date), date)
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

export const calculateTotalBalance = (
  transactions: Transaction[], 
  userId: string | undefined
): number => {
  if (!userId) return 0;
  
  return transactions
    .filter(t => t.userId === userId)
    .reduce((acc, t) => {
      return t.type === "income" 
        ? acc + t.amount 
        : acc - t.amount;
    }, 0);
};

export const getCategorySummaryByType = (
  transactions: Transaction[],
  userId: string | undefined,
  type: TransactionType
): { category: string; total: number }[] => {
  if (!userId) return [];
  
  const filteredTransactions = transactions.filter(
    t => t.userId === userId && t.type === type
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
