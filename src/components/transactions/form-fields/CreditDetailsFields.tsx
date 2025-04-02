
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreditDetailsFieldsProps {
  creditorName: string;
  setCreditorName: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
}

const CreditDetailsFields = ({
  creditorName,
  setCreditorName,
  dueDate,
  setDueDate
}: CreditDetailsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="creditorName">Nombre del acreedor</Label>
        <Input 
          id="creditorName" 
          type="text" 
          placeholder="Nombre de la persona o entidad" 
          required 
          value={creditorName} 
          onChange={e => setCreditorName(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Fecha de vencimiento</Label>
        <Input 
          id="dueDate" 
          type="date" 
          required 
          value={dueDate} 
          onChange={e => setDueDate(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default CreditDetailsFields;
