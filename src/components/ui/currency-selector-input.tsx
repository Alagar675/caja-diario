
import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DollarSign,
  Euro,
  PoundSterling,
  CurrencyIcon
} from "lucide-react"

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  icon?: React.ReactNode;
}

const currencies: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD', icon: <DollarSign className="h-4 w-4" /> },
  { code: 'EUR', symbol: '€', label: 'EUR', icon: <Euro className="h-4 w-4" /> },
  { code: 'GBP', symbol: '£', label: 'GBP', icon: <PoundSterling className="h-4 w-4" /> },
  { code: 'JPY', symbol: '¥', label: 'JPY', icon: <CurrencyIcon className="h-4 w-4" /> },
  { code: 'COP', symbol: '$', label: 'COP', icon: <CurrencyIcon className="h-4 w-4" /> },
  { code: 'MXN', symbol: '$', label: 'MXN', icon: <CurrencyIcon className="h-4 w-4" /> },
];

interface CurrencySelectorInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onCurrencyChange?: (currency: string) => void;
  selectedCurrency?: string;
  className?: string;
}

const CurrencySelectorInput = React.forwardRef<HTMLInputElement, CurrencySelectorInputProps>(
  ({ 
    value, 
    onChange, 
    onCurrencyChange,
    selectedCurrency = "USD",
    className,
    ...props 
  }, ref) => {
    const handleCurrencyChange = (currencyCode: string) => {
      onCurrencyChange?.(currencyCode);
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!newValue) {
        onChange("");
        return;
      }

      // Clear input if it starts with non-numeric characters
      if (newValue.match(/^[^1-9]/)) {
        onChange("");
        return;
      }

      const cleanValue = newValue.replace(/[^\d.,]/g, '');
      onChange(cleanValue);
    };

    const selectedCurrencyOption = currencies.find(c => c.code === selectedCurrency) || currencies[0];

    return (
      <div className="relative flex w-full gap-2">
        <Select
          value={selectedCurrency}
          onValueChange={handleCurrencyChange}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                {selectedCurrencyOption.icon}
                <span>{selectedCurrencyOption.code}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem 
                key={currency.code} 
                value={currency.code}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  {currency.icon}
                  <span>{currency.code}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Input
            ref={ref}
            type="text"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            placeholder="1.000,00"
            value={value}
            onChange={handleValueChange}
            className={cn(
              "pl-2 pr-2 font-mono text-lg tracking-wider text-right",
              className
            )}
            style={{ 
              fontVariantNumeric: 'tabular-nums',
              direction: 'rtl'
            }}
            {...props}
          />
        </div>
      </div>
    );
  }
);

CurrencySelectorInput.displayName = "CurrencySelectorInput";

export { CurrencySelectorInput, type CurrencySelectorInputProps };

