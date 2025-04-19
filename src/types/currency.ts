
export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  symbolPosition?: "prefix" | "suffix";
  className?: string;
  showFeedback?: boolean;
  hideDecimals?: boolean;
  inputDirection?: "ltr" | "rtl";
}

export interface MonetaryInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  helpText?: string;
  className?: string;
  showFeedback?: boolean;
}

