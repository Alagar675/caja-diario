
export type TransactionType = "income" | "expense";

export type PaymentMethod = "cash" | "transfer" | "credit";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: Date;
  createdAt: Date;
  bankName?: string;
  transferNumber?: string;
  recipientName?: string;
  recipientId?: string;
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

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  source: "cash" | "transfer" | "credit";
  concept: string;
  authorizedBy: string;
  timestamp: Date;
}

export interface FinanceContextType {
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
