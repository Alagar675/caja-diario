
import * as React from "react";
import { CurrencyInputField } from "@/components/ui/currency-input-field";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { CurrencyInputLoading } from "./currency/currency-input-loading";
import { CurrencyInputWrapper } from "./currency/currency-input-wrapper";

interface EnhancedCurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onCurrencyChange?: (currency: string) => void;
  label?: string;
  helpText?: string;
  className?: string;
  showConversion?: boolean;
  targetCurrency?: string;
  showFeedback?: boolean;
}

export const EnhancedCurrencyInput = React.forwardRef<HTMLInputElement, EnhancedCurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    onCurrencyChange,
    label = "Valor en moneda local",
    helpText,
    showConversion = false,
    showFeedback = false,
    className,
    ...props 
  }, ref) => {
    const localeInfo = useGeoLocaleDetection();
    
    React.useEffect(() => {
      if (!localeInfo.loading) {
        onCurrencyChange?.(localeInfo.currencyCode);
      }
    }, [localeInfo.currencyCode, localeInfo.loading, onCurrencyChange]);
    
    if (localeInfo.loading) {
      return <CurrencyInputLoading label={label} />;
    }
    
    return (
      <CurrencyInputWrapper
        label={label}
        currencyCode={localeInfo.currencyCode}
        error={localeInfo.error}
        tooltipContent="Los últimos dos dígitos corresponden a los decimales"
        helpText={helpText}
      >
        <CurrencyInputField
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder=""
          className={className}
          showFeedback={showFeedback}
          inputDirection="rtl"
          {...props}
        />
      </CurrencyInputWrapper>
    );
  }
);

EnhancedCurrencyInput.displayName = "EnhancedCurrencyInput";
