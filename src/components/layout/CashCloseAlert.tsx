
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
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();

  // Permite habilitar "Usuario Temporal" para test, y entrar a la app
  const activarModoTemporal = () => {
    localStorage.setItem("temporalUserMode", "active");
    onOpenChange(false);
    toast({
      title: "Modo Usuario Temporal activado",
      description: "Ahora puede usar la aplicación para cerrar el sistema correctamente.",
      variant: "default",
    });
    navigate("/dashboard");
  };

  // Limpia el modo temporal y procede con el cierre de caja real
  const handleRealCashClose = () => {
    localStorage.removeItem("temporalUserMode");
    onGoToCashClose();
    onOpenChange(false); // Cierra la alerta (opcional)
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* Etiqueta clickable para modo temporal (TEST) */}
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
              (Click en el título para activar el modo Usuario Temporal y continuar usando la aplicación. Use esto solo para test.)
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
          <AlertDialogAction onClick={handleRealCashClose}>
            Realizar Cierre de Caja
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CashCloseAlert;
