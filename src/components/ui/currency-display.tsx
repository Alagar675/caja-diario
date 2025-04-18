
import * as React from "react";
import { cn } from "@/lib/utils";
import { formatCurrencyValue, getCurrencyDisplayInfo } from "@/utils/currency/currencyUtils";

interface CurrencyDisplayProps {
  value: number;
  currencyCode?: string;
  className?: string;
  showSymbol?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "positive" | "negative" | "muted";
  align?: "left" | "center" | "right";
}

export function CurrencyDisplay({
  value,
  currencyCode = "COP",
  className,
  showSymbol = true,
  size = "md",
  variant = "default",
  align = "right"
}: CurrencyDisplayProps) {
  const { symbol, position } = getCurrencyDisplayInfo(currencyCode);
  const formattedValue = formatCurrencyValue(value);
  const isNegative = value < 0;
  
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };
  
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  const variantClasses = {
    default: "",
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    muted: "text-gray-500 dark:text-gray-400"
  };
  
  return (
    <span 
      className={cn(
        "font-mono tabular-nums",
        sizeClasses[size],
        alignClasses[align],
        variantClasses[variant],
        isNegative && !variant && "text-red-600 dark:text-red-400",
        className
      )}
    >
      {isNegative && "-"}
      {showSymbol && position === "prefix" && symbol}
      {formattedValue.replace("-", "")}
      {showSymbol && position === "suffix" && ` ${symbol}`}
    </span>
  );
}
