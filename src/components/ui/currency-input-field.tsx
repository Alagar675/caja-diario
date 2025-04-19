
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { handleCurrencyInput } from "@/utils/currency/currencyInputUtils";
import { CurrencyInputProps } from "@/types/currency";

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "",
    className,
    showFeedback = false,
    hideDecimals = false,
    inputDirection = "ltr",
    ...props 
  }, ref) => {
    const { toast } = useToast();
    const [isFirstInput, setIsFirstInput] = React.useState(true);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (!rawValue) {
        onChange("");
        return;
      }

      handleCurrencyInput(rawValue, onChange);

      if (showFeedback && isFirstInput && rawValue.length > 0) {
        toast({
          title: "Formato de moneda",
          description: "Ingrese los números de derecha a izquierda. Los últimos dos dígitos serán los decimales",
          duration: 3000,
        });
        setIsFirstInput(false);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder=""
        value={value}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "font-mono text-base tracking-wider pl-3 pr-3 text-right",
          isFocused && "border-primary",
          className
        )}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          direction: 'ltr'
        }}
        maxLength={20}
        aria-label="Campo de entrada de moneda"
        {...props}
      />
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";
