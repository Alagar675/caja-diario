
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecipientFieldsProps {
  recipientName: string;
  setRecipientName: (value: string) => void;
  recipientId: string;
  setRecipientId: (value: string) => void;
}

const RecipientFields = ({
  recipientName,
  setRecipientName,
  recipientId,
  setRecipientId
}: RecipientFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="recipientName">Nombre</Label>
        <Input 
          id="recipientName" 
          type="text" 
          placeholder="Nombre completo" 
          required 
          value={recipientName} 
          onChange={e => setRecipientName(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="recipientId">Documento de identidad</Label>
        <Input 
          id="recipientId" 
          type="text" 
          placeholder="Número de documento" 
          required 
          value={recipientId} 
          onChange={e => setRecipientId(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default RecipientFields;
