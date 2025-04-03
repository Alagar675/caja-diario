
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
