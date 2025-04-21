
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const handleRealCashClose = () => {
    localStorage.removeItem("temporalUserMode");
    localStorage.setItem("needsCashClose", "false");
    onGoToCashClose();
    onOpenChange(false);
    navigate("/dashboard");
    toast.success("Listo para usar el sistema");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sistema Listo
          </AlertDialogTitle>
          <AlertDialogDescription>
            Presione continuar para usar el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleRealCashClose}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CashCloseAlert;
