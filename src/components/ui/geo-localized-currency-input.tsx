
import * as React from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Edit2, Globe, Check } from "lucide-react"
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection"
import { CurrencyInputField } from "@/components/ui/currency-input-field"
import { CurrencySelector } from "@/components/ui/currency-selector"

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
    const [isEditing, setIsEditing] = React.useState(false);
    const [selectedCurrency, setSelectedCurrency] = React.useState<string>(localeInfo.currencyCode);

    // Update selectedCurrency when localeInfo changes and we're not in editing mode
    React.useEffect(() => {
      if (!isEditing && !localeInfo.loading) {
        setSelectedCurrency(localeInfo.currencyCode);
        onCurrencyChange?.(localeInfo.currencyCode);
      }
    }, [localeInfo.currencyCode, isEditing, localeInfo.loading, onCurrencyChange]);
    
    const handleCurrencyChange = (newCurrency: string) => {
      setSelectedCurrency(newCurrency);
      onCurrencyChange?.(newCurrency);
    };
    
    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };
    
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

    // Format the currency options for the selector
    const currencyOptions = [
      { code: 'USD', symbol: '$', label: 'USD (US Dollar)' },
      { code: 'EUR', symbol: '€', label: 'EUR (Euro)' },
      { code: 'GBP', symbol: '£', label: 'GBP (British Pound)' },
      { code: 'JPY', symbol: '¥', label: 'JPY (Japanese Yen)' },
      { code: 'COP', symbol: '$', label: 'COP (Peso Colombiano)' },
      { code: 'MXN', symbol: '$', label: 'MXN (Peso Mexicano)' },
      { code: 'BRL', symbol: 'R$', label: 'BRL (Real Brasileño)' },
      { code: 'CAD', symbol: '$', label: 'CAD (Canadian Dollar)' },
      { code: 'AUD', symbol: '$', label: 'AUD (Australian Dollar)' },
      { code: 'CNY', symbol: '¥', label: 'CNY (Chinese Yuan)' },
      { code: 'INR', symbol: '₹', label: 'INR (Indian Rupee)' },
    ];
    
    const currentCurrency = currencyOptions.find(c => c.code === selectedCurrency) || 
      { code: selectedCurrency, symbol: localeInfo.currencySymbol, label: selectedCurrency };
    
    // Show loading state while we detect locale
    if (localeInfo.loading) {
      return (
        <div className="space-y-2">
          {label && <Label className="text-sm text-gray-500">{label}</Label>}
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-10 w-[90px] bg-gray-200 rounded"></div>
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
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex-shrink-0">
              <CurrencySelector
                selectedCurrency={selectedCurrency}
                onCurrencyChange={handleCurrencyChange}
                currencyOptions={currencyOptions}
              />
            </div>
          ) : (
            <div className="flex-shrink-0">
              <CurrencySelector
                selectedCurrency={selectedCurrency}
                onCurrencyChange={handleCurrencyChange}
                currencyOptions={currencyOptions}
                isReadOnly={true}
              />
            </div>
          )}
          
          <div className="relative flex-1">
            <CurrencyInputField
              ref={ref}
              value={value}
              onChange={onChange}
              placeholder={getPlaceholder()}
              currencySymbol="" // We're showing the currency in the selector
              className={className}
              {...props}
            />
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={toggleEditing}
            className="flex-shrink-0"
            title={isEditing ? "Confirmar moneda" : "Cambiar moneda"}
          >
            {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span>
            Detectado: {localeInfo.country} ({localeInfo.countryCode}) - {localeInfo.currency}
          </span>
        </div>
      </div>
    );
  }
);

GeoLocalizedCurrencyInput.displayName = "GeoLocalizedCurrencyInput";

export { GeoLocalizedCurrencyInput, type GeoLocalizedCurrencyInputProps };
