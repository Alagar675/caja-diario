
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { formatCurrency, parseCurrencyValue } from "@/utils/formatters";

interface WithdrawalFormData {
  amount: string;
  concept: string;
  authorizedBy: string;
}

interface WithdrawalDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBalanceType: "cash" | "transfer" | "credit" | null;
  withdrawalAmount: string;
  form: UseFormReturn<WithdrawalFormData>;
  onSubmit: () => void;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({
  open,
  setOpen,
  selectedBalanceType,
  withdrawalAmount,
  form,
  onSubmit
}) => {
  // Format withdrawal amount for display
  const displayAmount = withdrawalAmount ? 
    formatCurrency(parseCurrencyValue(withdrawalAmount)) : 
    formatCurrency(0);
    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Confirmar retiro de saldo</DialogTitle>
            <DialogDescription>
              Complete los siguientes datos para procesar el retiro.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Tipo:</label>
              <div className="col-span-3">
                {selectedBalanceType === "cash" && "Efectivo"}
                {selectedBalanceType === "transfer" && "Transferencias"}
                {selectedBalanceType === "credit" && "Créditos"}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Monto:</label>
              <div className="col-span-3 font-mono font-medium" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {displayAmount}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="concept" className="text-right text-sm font-medium">Concepto:</label>
              <div className="col-span-3">
                <Input 
                  id="concept" 
                  {...form.register("concept", {
                    required: "El concepto es requerido"
                  })} 
                  placeholder="Ingrese el concepto del retiro" 
                  className="w-full" 
                />
                {form.formState.errors.concept && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.concept.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="authorizedBy" className="text-right text-sm font-medium">Autorizado por:</label>
              <div className="col-span-3">
                <Input 
                  id="authorizedBy" 
                  {...form.register("authorizedBy", {
                    required: "El nombre es requerido"
                  })} 
                  placeholder="Nombre de quien autoriza" 
                  className="w-full" 
                />
                {form.formState.errors.authorizedBy && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.authorizedBy.message}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar retiro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
