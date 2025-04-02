
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  description: string;
  setDescription: (value: string) => void;
}

const DescriptionField = ({
  description,
  setDescription
}: DescriptionFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Descripción</Label>
      <Textarea 
        id="description" 
        placeholder="Detalle de la transacción" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        className="min-h-[100px] transition-all duration-200" 
      />
    </div>
  );
};

export default DescriptionField;
