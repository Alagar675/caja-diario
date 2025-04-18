
import { useState } from "react";
import { TransactionType, PaymentMethod } from "@/context/FinanceContext";
import { getCurrentDateForInput, getCurrentTimeForInput, parseCurrencyValue } from "@/utils/formatters";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";

export const useTransactionForm = (type: TransactionType, addTransaction: Function) => {
  const localeInfo = useGeoLocaleDetection();
  const [amount, setAmount] = useState("");
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
  const [currencyCode, setCurrencyCode] = useState(localeInfo.currencyCode || "COP");

  // The amount value is now directly the formatted string from the CurrencyInput component
  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

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
      amount: parseCurrencyValue(amount),
      category,
      description,
      paymentMethod,
      currencyCode, // Add currency code to transaction
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
    alert("Transacción archivada correctamente");
    resetForm();
  };

  return {
    formState: {
      amount,
      category,
      description,
      paymentMethod,
      bankName,
      transferNumber,
      creditorName,
      dueDate,
      recipientName,
      recipientId,
      date,
      time,
      dialogOpen,
      confirmDialogOpen,
      lastTransaction,
      currencyCode
    },
    handlers: {
      setCategory,
      setDescription,
      setPaymentMethod,
      setBankName,
      setTransferNumber,
      setCreditorName,
      setDueDate,
      setRecipientName,
      setRecipientId,
      setDate,
      setTime,
      handleAmountChange,
      handleSubmit,
      handleConfirmedSubmit,
      handlePrint,
      handleArchive,
      setCurrencyCode
    },
    setDialogOpen,
    setConfirmDialogOpen
  };
};
