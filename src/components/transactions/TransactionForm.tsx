
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useFinance, TransactionType } from "@/context/FinanceContext";
import TransactionFormFields from "./TransactionFormFields";
import ConfirmationDialog from "./ConfirmationDialog";
import SuccessDialog from "./SuccessDialog";
import TransactionFormHeader from "./TransactionFormHeader";
import TransactionFormActions from "./TransactionFormActions";
import { useTransactionForm } from "@/hooks/useTransactionForm";

interface TransactionFormProps {
  type: TransactionType;
}

const TransactionForm = ({ type }: TransactionFormProps) => {
  const { addTransaction } = useFinance();
  const { 
    formState, 
    handlers,
    setConfirmDialogOpen,
    setDialogOpen
  } = useTransactionForm(type, addTransaction);
  
  return (
    <>
      <Card className="w-full max-w-2xl mx-auto glass animate-fade-in">
        <TransactionFormHeader type={type} />
        <CardContent>
          <form onSubmit={handlers.handleSubmit}>
            <TransactionFormFields
              type={type}
              amount={formState.amount}
              setAmount={handlers.handleAmountChange}
              category={formState.category}
              setCategory={handlers.setCategory}
              description={formState.description}
              setDescription={handlers.setDescription}
              paymentMethod={formState.paymentMethod}
              setPaymentMethod={handlers.setPaymentMethod}
              bankName={formState.bankName}
              setBankName={handlers.setBankName}
              transferNumber={formState.transferNumber}
              setTransferNumber={handlers.setTransferNumber}
              creditorName={formState.creditorName}
              setCreditorName={handlers.setCreditorName}
              dueDate={formState.dueDate}
              setDueDate={handlers.setDueDate}
              recipientName={formState.recipientName}
              setRecipientName={handlers.setRecipientName}
              recipientId={formState.recipientId}
              setRecipientId={handlers.setRecipientId}
              date={formState.date}
              setDate={handlers.setDate}
              time={formState.time}
              setTime={handlers.setTime}
            />
          </form>
        </CardContent>
        <TransactionFormActions type={type} onSubmit={handlers.handleSubmit} />
      </Card>

      <ConfirmationDialog
        open={formState.confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handlers.handleConfirmedSubmit}
      />

      <SuccessDialog
        open={formState.dialogOpen}
        onOpenChange={setDialogOpen}
        onPrint={handlers.handlePrint}
        onArchive={handlers.handleArchive}
      />
    </>
  );
};

export default TransactionForm;
