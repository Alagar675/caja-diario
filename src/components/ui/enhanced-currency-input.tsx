
import * as React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { CurrencyInputField } from "@/components/ui/currency-input-field";
import { getCurrencyDisplayInfo, parseCurrencyValue } from "@/utils/currency/currencyUtils";
import { Globe, AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";

interface EnhancedCurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onCurrencyChange?: (currency: string) => void;
  label?: string;
  helpText?: string;
  className?: string;
  showConversion?: boolean;
  targetCurrency?: string;
  showFeedback?: boolean; // Added showFeedback prop
}

export const EnhancedCurrencyInput = React.forwardRef<HTMLInputElement, EnhancedCurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    onCurrencyChange,
    label = "Valor en moneda local",
    helpText,
    showConversion = false,
    showFeedback = false, // Add default value for showFeedback prop
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
    
    const getPlaceholder = () => {
      const { thousandSeparator, decimalSeparator } = localeInfo;
      if (thousandSeparator === '.') {
        return `10.000${decimalSeparator}00`;
      } else {
        return `10${thousandSeparator}000${decimalSeparator}00`;
      }
    };
    
    const currencyInfo = React.useMemo(() => {
      return getCurrencyDisplayInfo(localeInfo.currencyCode);
    }, [localeInfo.currencyCode]);
    
    // Calculate converted value if needed
    const convertedValue = React.useMemo(() => {
      if (!showConversion || !targetCurrency || conversionLoading) return null;
      
      const numericValue = parseCurrencyValue(value);
      if (numericValue === 0) return 0;
      
      return convertValue(numericValue, localeInfo.currencyCode, targetCurrency);
    }, [value, showConversion, targetCurrency, conversionLoading, localeInfo.currencyCode, convertValue]);
    
    if (localeInfo.loading) {
      return (
        <div className="space-y-2">
          {label && <Label className="text-sm text-gray-500">{label}</Label>}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 flex-1 bg-gray-200 rounded"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {label && <Label className="text-sm text-gray-500">{label}</Label>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                    <Info className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Los últimos dos dígitos corresponden a los decimales</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {localeInfo.error && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {localeInfo.error}
            </span>
          )}
        </div>
        
        <div className="relative">
          <CurrencyInputField
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={getPlaceholder()}
            currencySymbol={currencyInfo.symbol}
            symbolPosition={currencyInfo.position}
            className={className}
            showFeedback={showFeedback} // Pass the showFeedback prop to CurrencyInputField
            {...props}
          />
          
          {showConversion && targetCurrency && convertedValue !== null && (
            <div className="mt-1 text-xs text-gray-500">
              ≈ {getCurrencyDisplayInfo(targetCurrency).symbol} {convertedValue.toFixed(2)} {targetCurrency}
            </div>
          )}
        </div>
        
        <div 
          className="absolute bottom-[-20px] right-0 flex items-center text-xs text-gray-500 opacity-70"
          style={{ fontSize: '0.6rem' }}
        >
          <Globe className="h-3 w-3 mr-1" />
          {localeInfo.currencyCode}
        </div>
        
        {helpText && (
          <p className="text-xs text-gray-500 mt-1">{helpText}</p>
        )}
      </div>
    );
  }
);

EnhancedCurrencyInput.displayName = "EnhancedCurrencyInput";
