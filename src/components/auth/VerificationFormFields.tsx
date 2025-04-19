
import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface VerificationFormFieldsProps {
  form: UseFormReturn<{
    code?: string;
  }, any, undefined>;
}

const VerificationFormFields: React.FC<VerificationFormFieldsProps> = ({ form }) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="code">Código de verificación</Label>
      <div className="flex justify-center py-4">
        <Controller
          control={form.control}
          name="code"
          render={({ field }) => (
            <InputOTP 
              maxLength={6} 
              value={field.value || ""}
              onChange={(value) => field.onChange(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          )}
        />
      </div>
      {form.formState.errors.code && (
        <p className="text-sm text-red-500 text-center">{form.formState.errors.code?.message}</p>
      )}
    </div>
  );
};

export default VerificationFormFields;
