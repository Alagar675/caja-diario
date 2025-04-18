
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
      const newValue = e.target.value;
      
      // Allow empty input
      if (!newValue) {
        onChange("");
        return;
      }
      
      // Solo permitir dígitos, separadores decimales y de miles
      const cleanValue = newValue.replace(/[^\d.,]/g, '');
      
      // Formatear mientras el usuario escribe
      let formattedValue = cleanValue;
      
      // Remover todos los separadores existentes
      const valueWithoutSeparators = cleanValue.replace(/[.,]/g, '');
      
      // Agregar separadores de miles
      const parts = [];
      for (let i = valueWithoutSeparators.length; i > 0; i -= 3) {
        parts.unshift(valueWithoutSeparators.slice(Math.max(0, i - 3), i));
      }
      
      // Reconstruir el valor con separadores
      formattedValue = parts.join('.');
      
      // Agregar decimales si existen
      if (cleanValue.includes(',')) {
        const decimals = cleanValue.split(',')[1];
        formattedValue += `,${decimals}`;
      }
      
      onChange(formattedValue);
    };

    // Cuando el campo obtiene el foco, seleccionar todo el texto
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
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-3 font-normal text-base",
            className
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";
