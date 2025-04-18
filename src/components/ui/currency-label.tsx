
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CurrencyLabelProps {
  label: string;
  tooltipContent?: string;
}

export const CurrencyLabel: React.FC<CurrencyLabelProps> = ({
  label,
  tooltipContent
}) => {
  if (!label) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm text-gray-500">{label}</Label>
      {tooltipContent && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                <Info className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
