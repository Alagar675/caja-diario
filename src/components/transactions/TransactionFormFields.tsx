
import React from "react";
import { TransactionType, PaymentMethod } from "@/types/finance";
import {
  AmountCategoryFields,
  DescriptionField,
  PaymentMethodField,
  TransferDetailsFields,
  CreditDetailsFields,
  RecipientFields,
  DateTimeFields
} from "./form-fields";

interface TransactionFormFieldsProps {
  type: TransactionType;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
  bankName: string;
  setBankName: (value: string) => void;
  transferNumber: string;
  setTransferNumber: (value: string) => void;
  creditorName: string;
  setCreditorName: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientId: string;
  setRecipientId: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}

const TransactionFormFields = ({
  type,
  amount,
  setAmount,
  category,
  setCategory,
  description,
  setDescription,
  paymentMethod,
  setPaymentMethod,
  bankName,
  setBankName,
  transferNumber,
  setTransferNumber,
  creditorName,
  setCreditorName,
  dueDate,
  setDueDate,
  recipientName,
  setRecipientName,
  recipientId,
  setRecipientId,
  date,
  setDate,
  time,
  setTime
}: TransactionFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <AmountCategoryFields
        type={type}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
      />

      <DescriptionField
        description={description}
        setDescription={setDescription}
      />

      <PaymentMethodField
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {paymentMethod === "transfer" && (
        <TransferDetailsFields
          bankName={bankName}
          setBankName={setBankName}
          transferNumber={transferNumber}
          setTransferNumber={setTransferNumber}
        />
      )}

      {paymentMethod === "credit" && (
        <CreditDetailsFields
          creditorName={creditorName}
          setCreditorName={setCreditorName}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
      )}

      <RecipientFields
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        recipientId={recipientId}
        setRecipientId={setRecipientId}
      />

      <DateTimeFields
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
      />
    </div>
  );
};

export default TransactionFormFields;
