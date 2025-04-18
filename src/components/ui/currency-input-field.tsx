
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CurrencyInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  className?: string;
  showFeedback?: boolean;
}

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "0,00",
    currencySymbol = "",
    className,
    showFeedback = false,
    ...props 
  }, ref) => {
    const { toast } = useToast();
    const [isFirstInput, setIsFirstInput] = React.useState(true);
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Remove non-numeric characters
      value = value.replace(/\D/g, "");

      if (value.length === 0) {
        onChange("");
        return;
      }

      // Ensure two decimal places
      if (value.length === 1) value = "0" + value;
      if (value.length === 2) value = "0" + value;

      // Split integer and decimal parts
      const integerPart = value.slice(0, -2);
      const decimalPart = value.slice(-2);

      // Format integer part with thousand separators
      let formattedInteger = integerPart;
      if (formattedInteger === "") {
        formattedInteger = "0";
      } else {
        formattedInteger = formattedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      // Combine with decimal separator
      const formattedValue = `${formattedInteger},${decimalPart}`;
      
      onChange(formattedValue);

      // Show feedback on first successful input
      if (showFeedback && isFirstInput && value.length > 0) {
        toast({
          title: "Formato de moneda",
          description: "Los últimos dos dígitos corresponden a los decimales",
          duration: 3000,
        });
        setIsFirstInput(false);
      }
    };

    // Select all text on focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    return (
      <div className="relative w-full">
        {currencySymbol && (
          <span 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 select-none z-10"
            aria-hidden="true"
          >
            {currencySymbol}
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-3 font-mono text-base tracking-wider",
            currencySymbol && "pl-7",
            className
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          maxLength={20}
          aria-label="Campo de entrada de moneda"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";

