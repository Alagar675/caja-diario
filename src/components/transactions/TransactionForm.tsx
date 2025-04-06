
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance, TransactionType, PaymentMethod } from "@/context/FinanceContext";
import { getCurrentDateForInput, getCurrentTimeForInput, parseCurrencyValue, formatCurrencyValue } from "@/utils/formatters";
import TransactionFormFields from "./TransactionFormFields";
import ConfirmationDialog from "./ConfirmationDialog";
import SuccessDialog from "./SuccessDialog";

interface TransactionFormProps {
  type: TransactionType;
}

const TransactionForm = ({
  type
}: TransactionFormProps) => {
  const {
    addTransaction
  } = useFinance();
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [bankName, setBankName] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [creditorName, setCreditorName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [date, setDate] = useState(getCurrentDateForInput());
  const [time, setTime] = useState(getCurrentTimeForInput());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const handleAmountChange = (value: string) => {
    if (value === '') {
      setFormattedAmount('');
      setAmount('');
      return;
    }

    // Limit to 20 digits total (excluding separators)
    const digitCount = value.replace(/[^\d]/g, '').length;
    if (digitCount > 20) {
      return;
    }

    const numericValue = parseCurrencyValue(value);
    setAmount(numericValue.toString());
    setFormattedAmount(formatCurrencyValue(numericValue));
  };

  const resetForm = () => {
    setAmount("");
    setFormattedAmount("");
    setCategory("");
    setDescription("");
    setPaymentMethod("cash");
    setBankName("");
    setTransferNumber("");
    setRecipientName("");
    setRecipientId("");
    setDate(getCurrentDateForInput());
    setTime(getCurrentTimeForInput());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialogOpen(true);
  };

  const handleConfirmedSubmit = () => {
    setConfirmDialogOpen(false);
    
    const dateTime = new Date(`${date}T${time}`);
    const transaction = {
      type,
      amount: parseCurrencyValue(formattedAmount),
      category,
      description,
      paymentMethod,
      bankName: paymentMethod === "transfer" ? bankName : undefined,
      transferNumber: paymentMethod === "transfer" ? transferNumber : undefined,
      recipientName,
      recipientId,
      date: dateTime
    };
    
    addTransaction(transaction);
    setLastTransaction(transaction);
    setDialogOpen(true);
  };

  const handlePrint = () => {
    setDialogOpen(false);
    // Show system print dialog
    window.print();
    resetForm();
  };

  const handleArchive = () => {
    setDialogOpen(false);
    // This would typically trigger a file save dialog
    // For demo purposes we'll just show an alert
    alert("Transacción archivada correctamente");
    resetForm();
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto glass animate-fade-in">
        <CardHeader>
          <CardTitle className={type === "income" ? "text-green-900" : "text-red-800"}>
            {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
          </CardTitle>
          <CardDescription>
            Complete los detalles de la transacción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TransactionFormFields
              type={type}
              amount={formattedAmount}
              setAmount={handleAmountChange}
              category={category}
              setCategory={setCategory}
              description={description}
              setDescription={setDescription}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              bankName={bankName}
              setBankName={setBankName}
              transferNumber={transferNumber}
              setTransferNumber={setTransferNumber}
              creditorName={creditorName}
              setCreditorName={setCreditorName}
              dueDate={dueDate}
              setDueDate={setDueDate}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              recipientId={recipientId}
              setRecipientId={setRecipientId}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
            />
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
          </Button>
        </CardFooter>
      </Card>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmedSubmit}
      />

      <SuccessDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPrint={handlePrint}
        onArchive={handleArchive}
      />
    </>
  );

  function resetForm() {
    setAmount("");
    setFormattedAmount("");
    setCategory("");
    setDescription("");
    setPaymentMethod("cash");
    setBankName("");
    setTransferNumber("");
    setRecipientName("");
    setRecipientId("");
    setDate(getCurrentDateForInput());
    setTime(getCurrentTimeForInput());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setConfirmDialogOpen(true);
  }

  function handleConfirmedSubmit() {
    setConfirmDialogOpen(false);
    
    const dateTime = new Date(`${date}T${time}`);
    const transaction = {
      type,
      amount: parseCurrencyValue(formattedAmount),
      category,
      description,
      paymentMethod,
      bankName: paymentMethod === "transfer" ? bankName : undefined,
      transferNumber: paymentMethod === "transfer" ? transferNumber : undefined,
      recipientName,
      recipientId,
      date: dateTime
    };
    
    addTransaction(transaction);
    setLastTransaction(transaction);
    setDialogOpen(true);
  }

  function handlePrint() {
    setDialogOpen(false);
    // Show system print dialog
    window.print();
    resetForm();
  }

  function handleArchive() {
    setDialogOpen(false);
    // This would typically trigger a file save dialog
    // For demo purposes we'll just show an alert
    alert("Transacción archivada correctamente");
    resetForm();
  }
};

export default TransactionForm;
