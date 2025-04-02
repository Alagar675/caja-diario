
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TransferDetailsFieldsProps {
  bankName: string;
  setBankName: (value: string) => void;
  transferNumber: string;
  setTransferNumber: (value: string) => void;
}

const TransferDetailsFields = ({
  bankName,
  setBankName,
  transferNumber,
  setTransferNumber
}: TransferDetailsFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="bankName">Banco</Label>
        <Input 
          id="bankName" 
          type="text" 
          placeholder="Nombre del banco" 
          required 
          value={bankName} 
          onChange={e => setBankName(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="transferNumber">Número de transferencia</Label>
        <Input 
          id="transferNumber" 
          type="text" 
          placeholder="Número de transferencia" 
          required 
          value={transferNumber} 
          onChange={e => setTransferNumber(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default TransferDetailsFields;
