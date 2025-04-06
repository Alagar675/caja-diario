
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface RecoveryAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onRecover: () => void;
}

const RecoveryAlert = ({ open, onOpenChange, onCancel, onRecover }: RecoveryAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restaurar Sistema</AlertDialogTitle>
          <AlertDialogDescription>
            El sistema se cerró de forma inesperada. ¿Desea restaurar su sesión a la última acción realizada?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>No, iniciar de nuevo</AlertDialogCancel>
          <AlertDialogAction onClick={onRecover}>Sí, restaurar sistema</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RecoveryAlert;
