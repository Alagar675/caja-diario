
import * as React from "react"
import { Label } from "@/components/ui/label"
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection"
import { CurrencyInputField } from "@/components/ui/currency-input-field"

interface GeoLocalizedCurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onCurrencyChange?: (currency: string) => void;
  label?: string;
  className?: string;
}

const GeoLocalizedCurrencyInput = React.forwardRef<HTMLInputElement, GeoLocalizedCurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    onCurrencyChange,
    label = "Ingrese el valor en su moneda local (detectada automáticamente)",
    className,
    ...props 
  }, ref) => {
    const localeInfo = useGeoLocaleDetection();

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
          {label && <Label className="text-sm text-gray-500">{label}</Label>}
          {localeInfo.error && (
            <span className="text-xs text-amber-600">
              {localeInfo.error}
            </span>
          )}
        </div>
        
        <div className="relative">
          <CurrencyInputField
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder=""
            currencySymbol=""
            className={className}
            inputDirection="rtl"
            {...props}
          />
        </div>
        
        <div 
          className="absolute bottom-[-20px] right-0 text-xs text-gray-500 opacity-70"
          style={{ fontSize: '0.6rem' }}
        >
          {localeInfo.currencyCode}
        </div>
      </div>
    );
  }
);

GeoLocalizedCurrencyInput.displayName = "GeoLocalizedCurrencyInput";

export { GeoLocalizedCurrencyInput, type GeoLocalizedCurrencyInputProps };
