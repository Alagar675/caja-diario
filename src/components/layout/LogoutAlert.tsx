
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface LogoutAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onGoToReports: () => void;
  onPerformLogout: () => void;
}

const LogoutAlert = ({ open, onOpenChange, onCancel, onGoToReports, onPerformLogout }: LogoutAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Recordatorio Importante</AlertDialogTitle>
          <AlertDialogDescription>
            Antes de salir, debe realizar el cierre de caja diario en la sección de Informes.
            De lo contrario no podrá cerrar la aplicación correctamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert className="mt-4 border-yellow-500 bg-yellow-50 text-yellow-800">
          <AlertTitle className="text-yellow-800">¡Atención!</AlertTitle>
          <AlertDescription className="text-yellow-700">
            No realizar el cierre de caja puede causar inconsistencias en sus registros financieros.
          </AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onGoToReports}>Ir a Informes</AlertDialogAction>
          <AlertDialogAction onClick={onPerformLogout}>Ir a cierre de caja diario</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlert;
