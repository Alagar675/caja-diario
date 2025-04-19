
import React from "react";
import { TransactionType, PaymentMethod } from "@/types/finance";
import { FormFieldsLayout } from "./form-fields/layout/FormFieldsLayout";
import {
  AmountCategoryFields,
  DescriptionField,
  PaymentMethodField,
  TransferDetailsFields,
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
  setCurrencyCode?: (value: string) => void;
}

const TransactionFormFields: React.FC<TransactionFormFieldsProps> = (props) => {
  return (
    <FormFieldsLayout>
      <AmountCategoryFields
        type={props.type}
        amount={props.amount}
        setAmount={props.setAmount}
        category={props.category}
        setCategory={props.setCategory}
        setCurrencyCode={props.setCurrencyCode}
      />

      <DescriptionField
        description={props.description}
        setDescription={props.setDescription}
      />

      <PaymentMethodField
        paymentMethod={props.paymentMethod}
        setPaymentMethod={props.setPaymentMethod}
      />

      {props.paymentMethod === "transfer" && (
        <TransferDetailsFields
          bankName={props.bankName}
          setBankName={props.setBankName}
          transferNumber={props.transferNumber}
          setTransferNumber={props.setTransferNumber}
        />
      )}

      <RecipientFields
        recipientName={props.recipientName}
        setRecipientName={props.setRecipientName}
        recipientId={props.recipientId}
        setRecipientId={props.setRecipientId}
      />

      <DateTimeFields
        date={props.date}
        setDate={props.setDate}
        time={props.time}
        setTime={props.setTime}
      />
    </FormFieldsLayout>
  );
};

export default TransactionFormFields;
