
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Archive } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrint: () => void;
  onArchive: () => void;
}

const SuccessDialog = ({
  open,
  onOpenChange,
  onPrint,
  onArchive
}: SuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transacción registrada</DialogTitle>
          <DialogDescription>
            La transacción ha sido registrada correctamente. ¿Qué desea hacer ahora?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            type="button" 
            onClick={onPrint}
            className="gap-2"
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
          <Button
            type="button" 
            variant="secondary"
            onClick={onArchive}
            className="gap-2"
          >
            <Archive className="size-4" />
            Archivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessDialog;
