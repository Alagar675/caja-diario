
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import RecoveryAlert from "./RecoveryAlert";
import CashCloseAlert from "./CashCloseAlert";
import useDailyCashClose from "@/hooks/useDailyCashClose";

interface RecoveryHandlerProps {
  showRecoveryAlert: boolean;
  setShowRecoveryAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecoveryHandler = ({ showRecoveryAlert, setShowRecoveryAlert }: RecoveryHandlerProps) => {
  const navigate = useNavigate();
  const [showCashCloseAlert, setShowCashCloseAlert] = React.useState(false);
  
  const handleRecovery = () => {
    const lastAction = localStorage.getItem("lastAction");
    if (lastAction) {
      localStorage.setItem("needsRecovery", "false");
      localStorage.setItem("abnormalExit", "false");
      try {
        navigate(lastAction);
        toast.success("Sesión restaurada correctamente");
      } catch (error) {
        navigate("/dashboard");
        toast.error("Error al restaurar. Redirigiendo al inicio");
      }
    }
    setShowRecoveryAlert(false);
  };
  
  const cancelRecovery = () => {
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    setShowRecoveryAlert(false);
    navigate("/login");
  };
  
  const handleGoToCashClose = () => {
    setShowCashCloseAlert(false);
    navigate("/reports");
  };

  return (
    <>
      <RecoveryAlert
        open={showRecoveryAlert}
        onOpenChange={setShowRecoveryAlert}
        onCancel={cancelRecovery}
        onRecover={handleRecovery}
      />
      
      <CashCloseAlert
        open={showCashCloseAlert}
        onOpenChange={setShowCashCloseAlert}
        onGoToCashClose={handleGoToCashClose}
      />
    </>
  );
};

export default RecoveryHandler;
