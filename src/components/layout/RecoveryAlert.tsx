
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
          <AlertDialogTitle>Recuperar Sesión</AlertDialogTitle>
          <AlertDialogDescription>
            Se detectó una interrupción inesperada del sistema. ¿Desea restaurar su sesión a la última acción realizada?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>No, iniciar de nuevo</AlertDialogCancel>
          <AlertDialogAction onClick={onRecover}>Sí, recuperar sesión</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RecoveryAlert;
