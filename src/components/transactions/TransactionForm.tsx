
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinance, TransactionType, PaymentMethod } from "@/context/FinanceContext";
import { getCurrentDateForInput, getCurrentTimeForInput } from "@/utils/formatters";
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
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [bankName, setBankName] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [date, setDate] = useState(getCurrentDateForInput());
  const [time, setTime] = useState(getCurrentTimeForInput());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const resetForm = () => {
    setAmount("");
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
      amount: Number(amount),
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
              amount={amount}
              setAmount={setAmount}
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
};

export default TransactionForm;
