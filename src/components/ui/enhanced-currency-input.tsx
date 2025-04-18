
import * as React from "react";
import { CurrencyInputField } from "@/components/ui/currency-input-field";
import { CurrencyLabel } from "@/components/ui/currency-label";
import { CurrencyInfoDisplay } from "@/components/ui/currency-info-display";
import { getCurrencyDisplayInfo } from "@/utils/currency/currencyUtils";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";

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
    targetCurrency,
    className,
    ...props 
  }, ref) => {
    const localeInfo = useGeoLocaleDetection();
    const { convertValue, loading: conversionLoading } = useCurrencyConversion();
    
    React.useEffect(() => {
      if (!localeInfo.loading) {
        onCurrencyChange?.(localeInfo.currencyCode);
      }
    }, [localeInfo.currencyCode, localeInfo.loading, onCurrencyChange]);
    
    const currencyInfo = React.useMemo(() => {
      return getCurrencyDisplayInfo(localeInfo.currencyCode);
    }, [localeInfo.currencyCode]);
    
    if (localeInfo.loading) {
      return (
        <div className="space-y-2">
          <CurrencyLabel label={label} />
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 flex-1 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-2 relative">
        <CurrencyLabel 
          label={label} 
          tooltipContent="Los últimos dos dígitos corresponden a los decimales"
        />
        
        <div className="relative">
          <CurrencyInputField
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder=""
            currencySymbol={currencyInfo.symbol}
            symbolPosition={currencyInfo.position}
            className={className}
            showFeedback={showFeedback}
            {...props}
          />
          
          {helpText && (
            <p className="text-xs text-gray-500 mt-1">{helpText}</p>
          )}
        </div>
        
        <CurrencyInfoDisplay 
          currencyCode={localeInfo.currencyCode}
          error={localeInfo.error}
        />
      </div>
    );
  }
);

EnhancedCurrencyInput.displayName = "EnhancedCurrencyInput";
