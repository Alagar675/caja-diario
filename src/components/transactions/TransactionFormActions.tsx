
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/finance";

interface TransactionFormActionsProps {
  type: TransactionType;
  onSubmit: (e: React.FormEvent) => void;
}

const TransactionFormActions: React.FC<TransactionFormActionsProps> = ({ type, onSubmit }) => {
  return (
    <CardFooter>
      <Button type="submit" className="w-full" onClick={onSubmit}>
        {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
      </Button>
    </CardFooter>
  );
};

export default TransactionFormActions;
