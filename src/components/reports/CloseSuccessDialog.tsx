
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, LogOut } from "lucide-react";

interface CloseSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
}

const CloseSuccessDialog: React.FC<CloseSuccessDialogProps> = ({
  open,
  onOpenChange,
  onExit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center">
            <Check className="h-6 w-6 text-green-500 mr-2" />
            Cierre Exitoso
          </DialogTitle>
          <DialogDescription className="text-center">
            El cierre de caja diario ha sido registrado correctamente.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <p>Todas las transacciones han sido procesadas y archivadas.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Al hacer clic en Aceptar, se finalizará la sesión del sistema y necesitará iniciar sesión nuevamente para continuar.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onExit} className="w-full flex items-center justify-center">
            <LogOut className="h-4 w-4 mr-2" /> Aceptar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseSuccessDialog;
