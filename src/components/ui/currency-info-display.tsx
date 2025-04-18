
import React from "react";
import { Globe, AlertCircle } from "lucide-react";

interface CurrencyInfoDisplayProps {
  currencyCode: string;
  error?: string | null;
}

export const CurrencyInfoDisplay: React.FC<CurrencyInfoDisplayProps> = ({
  currencyCode,
  error
}) => {
  return (
    <div className="flex items-center justify-between">
      <div 
        className="text-xs text-gray-500 opacity-70 flex items-center"
        style={{ fontSize: '0.6rem' }}
      >
        <Globe className="h-3 w-3 mr-1" />
        {currencyCode}
      </div>
      
      {error && (
        <span className="text-xs text-amber-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </div>
  );
};
