
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { currencyMap } from "@/utils/currency/currencyHelpers";

interface CurrencySelectionGridProps {
  sourceCurrency: string;
  targetCurrency: string;
  setSourceCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;
  handleSwapCurrencies: () => void;
  mostUsedCurrencies: string[];
}

export const CurrencySelectionGrid: React.FC<CurrencySelectionGridProps> = ({
  sourceCurrency,
  targetCurrency,
  setSourceCurrency,
  setTargetCurrency,
  handleSwapCurrencies,
  mostUsedCurrencies
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 items-center">
      <div className="col-span-2">
        <Label htmlFor="sourceCurrency" className="mb-1 block">De</Label>
        <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
          <SelectTrigger id="sourceCurrency">
            <SelectValue placeholder="Moneda origen" />
          </SelectTrigger>
          <SelectContent>
            <div className="font-medium text-xs text-gray-500 px-2 pb-1">Más usadas</div>
            {mostUsedCurrencies.map(code => (
              <SelectItem key={`source-${code}`} value={code}>
                {code} - {currencyMap[code]?.name || code}
              </SelectItem>
            ))}
            
            <div className="font-medium text-xs text-gray-500 px-2 pb-1 mt-2">Todas las monedas</div>
            {Object.keys(currencyMap).sort().map(code => (
              <SelectItem key={`source-all-${code}`} value={code}>
                {code} - {currencyMap[code].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-1 flex justify-center">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={handleSwapCurrencies}
          className="rounded-full h-8 w-8"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="col-span-2">
        <Label htmlFor="targetCurrency" className="mb-1 block">A</Label>
        <Select value={targetCurrency} onValueChange={setTargetCurrency}>
          <SelectTrigger id="targetCurrency">
            <SelectValue placeholder="Moneda destino" />
          </SelectTrigger>
          <SelectContent>
            <div className="font-medium text-xs text-gray-500 px-2 pb-1">Más usadas</div>
            {mostUsedCurrencies.map(code => (
              <SelectItem key={`target-${code}`} value={code}>
                {code} - {currencyMap[code]?.name || code}
              </SelectItem>
            ))}
            
            <div className="font-medium text-xs text-gray-500 px-2 pb-1 mt-2">Todas las monedas</div>
            {Object.keys(currencyMap).sort().map(code => (
              <SelectItem key={`target-all-${code}`} value={code}>
                {code} - {currencyMap[code].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
