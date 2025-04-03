
import { Transaction, TransactionType, DailySummary } from "@/types/finance";
import { 
  filterTransactionsByDate, 
  calculateDailySummary, 
  calculateTotalBalance,
  getCategorySummaryByType,
  calculateBalanceSummary
} from "@/utils/financeUtils";

export const useTransactionOperations = (transactions: Transaction[], userId: string | undefined) => {
  const getTransactionsByDate = (startDate: Date, endDate: Date) => {
    if (!userId) return [];
    return filterTransactionsByDate(transactions, startDate, endDate, userId);
  };

  const getDailySummary = (date = new Date()): DailySummary => {
    return calculateDailySummary(transactions, userId, date);
  };

  const getTotalBalance = () => {
    return calculateTotalBalance(transactions, userId);
  };

  const getCategorySummary = (type: TransactionType) => {
    return getCategorySummaryByType(transactions, userId, type);
  };

  const generateDayEndReport = () => {
    const summary = getDailySummary();
    return summary;
  };

  const getBalanceSummary = () => {
    return calculateBalanceSummary(transactions, userId);
  };

  return {
    getTransactionsByDate,
    getDailySummary,
    getTotalBalance,
    getCategorySummary,
    generateDayEndReport,
    getBalanceSummary
  };
};
