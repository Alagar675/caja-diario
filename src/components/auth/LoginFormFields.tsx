
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormFieldsProps {
  form: UseFormReturn<{
    email?: string;
    password?: string;
  }, any, undefined>;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({ form }) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="ejemplo@correo.com" 
          {...form.register("email")} 
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email?.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input 
          id="password" 
          type="password" 
          {...form.register("password")} 
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">{form.formState.errors.password?.message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginFormFields;
