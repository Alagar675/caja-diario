import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, History } from "lucide-react";
import { formatCurrency, parseCurrencyValue } from "@/utils/formatters";
import { TransactionCurrencyInput } from "@/components/transactions/form-fields/currency/TransactionCurrencyInput";

interface WithdrawalSectionProps {
  selectedBalanceType: "cash" | "transfer" | "credit" | null;
  setSelectedBalanceType: (type: "cash" | "transfer" | "credit" | null) => void;
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  handleWithdrawalRequest: () => void;
  withdrawalSummary: {
    cashWithdrawals: number;
    transferWithdrawals: number;
    creditWithdrawals: number;
    totalWithdrawals: number;
  };
  setWithdrawalHistoryDialog: (open: boolean) => void;
}

const WithdrawalSection: React.FC<WithdrawalSectionProps> = ({
  selectedBalanceType,
  setSelectedBalanceType,
  withdrawalAmount,
  setWithdrawalAmount,
  handleWithdrawalRequest,
  withdrawalSummary,
  setWithdrawalHistoryDialog
}) => {
  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-center mb-3 rounded-lg">
        <h3 className="text-lg text-red-900 text-center font-medium">Retiro de Saldos Actuales</h3>
      </div>
      
      <div className="space-y-4 flex flex-col items-center">
        <div className="space-y-3 w-full max-w-xs">
          <div className="flex items-center space-x-2">
            <Checkbox id="cashBalance" checked={selectedBalanceType === "cash"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "cash" ? null : "cash")} />
            <label htmlFor="cashBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Efectivo
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="transferBalance" checked={selectedBalanceType === "transfer"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "transfer" ? null : "transfer")} />
            <label htmlFor="transferBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Transferencias
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="creditBalance" checked={selectedBalanceType === "credit"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "credit" ? null : "credit")} />
            <label htmlFor="creditBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Créditos
            </label>
          </div>
        </div>
        
        <div className="space-y-2 w-full max-w-xs">
          <div className="flex space-x-2">
            <div className="flex-1">
              <TransactionCurrencyInput
                amount={withdrawalAmount}
                setAmount={setWithdrawalAmount}
                label="Monto a retirar"
              />
            </div>
            <Button 
              onClick={handleWithdrawalRequest} 
              className="flex items-center whitespace-nowrap mt-8" 
              disabled={!selectedBalanceType || !withdrawalAmount || parseCurrencyValue(withdrawalAmount) <= 0}
            >
              <ArrowDown className="mr-1 h-4 w-4" />
              Retirar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t max-w-xs mx-auto">
        <h4 className="text-sm font-medium mb-2 text-center">Resumen de Retiros</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Efectivo:</span>
            <span className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(withdrawalSummary.cashWithdrawals)}</span>
          </div>
          <div className="flex justify-between">
            <span>Transferencias:</span>
            <span className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(withdrawalSummary.transferWithdrawals)}</span>
          </div>
          <div className="flex justify-between">
            <span>Créditos:</span>
            <span className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(withdrawalSummary.creditWithdrawals)}</span>
          </div>
          <div className="flex justify-between font-medium pt-1 border-t">
            <span>Total:</span>
            <span className="font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(withdrawalSummary.totalWithdrawals)}</span>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm" onClick={() => setWithdrawalHistoryDialog(true)} className="flex items-center text-xs w-full">
              <History className="h-3 w-3 mr-1" />
              Historial de Retiros
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSection;
