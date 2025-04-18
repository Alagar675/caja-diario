
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  className?: string;
}

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "0,00",
    currencySymbol = "",
    className,
    ...props 
  }, ref) => {
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Eliminar todo lo que no sea número
      value = value.replace(/\D/g, "");

      if (value.length === 0) {
        onChange("");
        return;
      }

      // Asegura que siempre haya al menos dos dígitos para los decimales
      if (value.length === 1) value = "0" + value;
      if (value.length === 2) value = "0" + value;

      // Separar la parte entera de los decimales
      const integerPart = value.slice(0, -2);
      const decimalPart = value.slice(-2);

      // Formatear la parte entera con puntos de mil
      let formattedInteger = integerPart;
      if (formattedInteger === "") {
        formattedInteger = "0";
      } else {
        formattedInteger = formattedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Unir con la coma decimal
      const formattedValue = `${formattedInteger},${decimalPart}`;
      
      onChange(formattedValue);
    };

    // When the field gets focus, select all text
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    return (
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
          {currencySymbol}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-3 font-mono text-base",
            className
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          maxLength={20}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";
