
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TransactionType } from "@/types/finance";

interface TransactionFormHeaderProps {
  type: TransactionType;
}

const TransactionFormHeader: React.FC<TransactionFormHeaderProps> = ({ type }) => {
  return (
    <CardHeader>
      <CardTitle className={type === "income" ? "text-green-900" : "text-red-800"}>
        {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
      </CardTitle>
      <CardDescription>
        Complete los detalles de la transacción
      </CardDescription>
    </CardHeader>
  );
};

export default TransactionFormHeader;
