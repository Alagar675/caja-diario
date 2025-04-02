
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
