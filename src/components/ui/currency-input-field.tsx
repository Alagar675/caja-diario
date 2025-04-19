import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrencyInput } from "@/utils/currency/currencyInputUtils";
import { CurrencyInputProps } from "@/types/currency";

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "",
    currencySymbol = "",
    symbolPosition = "prefix",
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

      const formattedValue = formatCurrencyInput(rawValue, hideDecimals);
      onChange(formattedValue);

      if (showFeedback && isFirstInput && formattedValue.length > 0) {
        toast({
          title: "Formato de moneda",
          description: "Los últimos dos dígitos corresponden a los decimales",
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
      <div className="relative w-full">
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
            "font-mono text-base tracking-wider pl-3 pr-3",
            inputDirection === 'rtl' ? 'text-right' : 'text-left',
            isFocused && "border-primary",
            className
          )}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: inputDirection
          }}
          maxLength={20}
          aria-label="Campo de entrada de moneda"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";
