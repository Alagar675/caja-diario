
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PaymentMethod } from "@/types/finance";

interface PaymentMethodFieldProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (value: PaymentMethod) => void;
}

const PaymentMethodField = ({
  paymentMethod,
  setPaymentMethod
}: PaymentMethodFieldProps) => {
  return (
    <div className="space-y-2">
      <Label>Método de pago</Label>
      <RadioGroup 
        defaultValue="cash" 
        value={paymentMethod} 
        onValueChange={value => setPaymentMethod(value as PaymentMethod)} 
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash">Efectivo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="transfer" id="transfer" />
          <Label htmlFor="transfer">Transferencia</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodField;
