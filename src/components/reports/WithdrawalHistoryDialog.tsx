
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Withdrawal } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";

interface WithdrawalHistoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  withdrawals: Withdrawal[];
}

const WithdrawalHistoryDialog: React.FC<WithdrawalHistoryDialogProps> = ({
  open,
  setOpen,
  withdrawals
}) => {
  const sortedWithdrawals = [...withdrawals].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historial de Retiros</DialogTitle>
          <DialogDescription>
            Registro de todos los retiros realizados
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {sortedWithdrawals.length > 0 ? (
            <div className="space-y-3">
              {sortedWithdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{withdrawal.concept}</p>
                        <p className="text-sm text-muted-foreground">
                          Autorizado por: {withdrawal.authorizedBy}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(withdrawal.timestamp), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          -{formatCurrency(withdrawal.amount)}
                        </p>
                        <p className="text-sm capitalize">
                          {withdrawal.source === "cash" ? "Efectivo" : 
                           withdrawal.source === "transfer" ? "Transferencia" : "Crédito"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No hay retiros registrados
            </p>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalHistoryDialog;
