
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface CashCloseAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToCashClose: () => void;
}

const CashCloseAlert = ({ open, onOpenChange, onGoToCashClose }: CashCloseAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cierre de Caja Pendiente</AlertDialogTitle>
          <AlertDialogDescription>
            Se detectó que la aplicación no se cerró correctamente o se ha iniciado un nuevo día de operaciones. 
            Es necesario realizar el cierre de caja antes de continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Alert className="mt-4 border-yellow-500 bg-yellow-50 text-yellow-800">
          <Clock className="h-4 w-4 text-yellow-800" />
          <AlertTitle className="text-yellow-800">¡Importante!</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Para mantener la integridad de los informes financieros, debe realizar el cierre de caja diario
            antes de continuar con las operaciones.
          </AlertDescription>
        </Alert>
        
        <AlertDialogFooter>
          <AlertDialogAction onClick={onGoToCashClose}>
            Realizar Cierre de Caja
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CashCloseAlert;
