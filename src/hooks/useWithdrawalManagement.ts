
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";

export const useWithdrawalManagement = () => {
  const [selectedBalanceType, setSelectedBalanceType] = useState<"cash" | "transfer" | "credit" | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalHistoryDialog, setWithdrawalHistoryDialog] = useState(false);
  
  const { addWithdrawal, getBalanceSummary, getTotalWithdrawals } = useFinance();
  
  const balanceSummary = getBalanceSummary();
  const withdrawalSummary = getTotalWithdrawals();
  
  const withdrawalForm = useForm({
    defaultValues: {
      amount: "",
      concept: "",
      authorizedBy: ""
    }
  });
  
  const handleWithdrawalRequest = () => {
    if (!selectedBalanceType) {
      toast.error("Debe seleccionar un tipo de saldo");
      return;
    }
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error("Debe ingresar un monto válido");
      return;
    }
    const amount = parseFloat(withdrawalAmount);
    let currentBalance = 0;
    switch (selectedBalanceType) {
      case "cash":
        currentBalance = balanceSummary.cashBalance;
        break;
      case "transfer":
        currentBalance = balanceSummary.transferBalance;
        break;
      case "credit":
        currentBalance = balanceSummary.creditBalance;
        break;
    }
    if (amount > currentBalance) {
      toast.error(`Saldo insuficiente. Saldo actual: ${formatCurrency(currentBalance)}`);
      return;
    }
    withdrawalForm.setValue("amount", withdrawalAmount);
    setWithdrawalDialogOpen(true);
  };
  
  const handleWithdrawalSubmit = withdrawalForm.handleSubmit(data => {
    const withdrawal = {
      amount: parseFloat(data.amount),
      source: selectedBalanceType as "cash" | "transfer" | "credit",
      concept: data.concept,
      authorizedBy: data.authorizedBy
    };
    addWithdrawal(withdrawal);
    setSelectedBalanceType(null);
    setWithdrawalAmount("");
    setWithdrawalDialogOpen(false);
    withdrawalForm.reset();
  });
  
  return {
    selectedBalanceType,
    setSelectedBalanceType,
    withdrawalAmount,
    setWithdrawalAmount,
    withdrawalDialogOpen,
    setWithdrawalDialogOpen,
    withdrawalHistoryDialog,
    setWithdrawalHistoryDialog,
    withdrawalForm,
    handleWithdrawalRequest,
    handleWithdrawalSubmit,
    balanceSummary,
    withdrawalSummary
  };
};

export default useWithdrawalManagement;
