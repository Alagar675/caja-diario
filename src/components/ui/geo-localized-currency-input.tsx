
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Globe } from "lucide-react"
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

    // Update currency when localeInfo changes
    React.useEffect(() => {
      if (!localeInfo.loading) {
        onCurrencyChange?.(localeInfo.currencyCode);
      }
    }, [localeInfo.currencyCode, localeInfo.loading, onCurrencyChange]);
    
    // Generate placeholder based on locale
    const getPlaceholder = () => {
      const { thousandSeparator, decimalSeparator } = localeInfo;
      if (thousandSeparator === '.') {
        // Latin American format
        return `10.000${decimalSeparator}00`;
      } else {
        // US/UK format
        return `10${thousandSeparator}000${decimalSeparator}00`;
      }
    };
    
    // Show loading state while we detect locale
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
      <div className="space-y-2">
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
            placeholder={getPlaceholder()}
            currencySymbol={`${localeInfo.currencyCode} `}
            className={className}
            {...props}
          />
        </div>
        
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span>
            Detectado: {localeInfo.country} ({localeInfo.countryCode})
          </span>
        </div>
      </div>
    );
  }
);

GeoLocalizedCurrencyInput.displayName = "GeoLocalizedCurrencyInput";

export { GeoLocalizedCurrencyInput, type GeoLocalizedCurrencyInputProps };
