
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Clock } from "lucide-react";

interface CashCloseAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToCashClose: () => void;
}

const CashCloseAlert = ({
  open,
  onOpenChange,
  onGoToCashClose,
}: CashCloseAlertProps) => {
  // Permite habilitar "Usuario Temporal" para test
  const activarModoTemporal = () => {
    // Cerrar la alerta y permitir que el usuario pruebe la app temporalmente
    onOpenChange(false);
    // Guardamos una marca en localStorage para simular el "Modo Usuario Temporal"
    localStorage.setItem("temporalUserMode", "active");
    // Aquí podrías agregar un toast para informar del modo temporal si lo deseas
    // Ejemplo (requiere importar { toast } de "@/hooks/use-toast" si es necesario):
    // toast.info("Modo Usuario Temporal activado. La aplicación está activa para test.");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Hacemos la etiqueta clickable */}
          <AlertDialogTitle
            className="cursor-pointer text-blue-700 underline"
            title="Click para activar aplicación en modo temporal"
            onClick={activarModoTemporal}
            tabIndex={0}
            style={{ userSelect: "none" }}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") activarModoTemporal();
            }}
            role="button"
            aria-pressed="false"
          >
            Cierre de Caja Pendiente
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se detectó que la aplicación no se cerró correctamente o se ha iniciado un nuevo día de operaciones.
            Es necesario realizar el cierre de caja antes de continuar.
            <span className="block mt-2 text-xs text-gray-500 italic">
              (Click en el título para activar el modo Usuario Temporal y continuar usando la aplicación)
            </span>
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

