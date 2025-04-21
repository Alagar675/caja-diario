
import React, { useEffect } from "react";
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
  const { checkIfCashClosureNeeded } = useDailyCashClose();
  
  // Check if cash close is needed when component mounts
  useEffect(() => {
    if (checkIfCashClosureNeeded()) {
      setShowCashCloseAlert(true);
    }
  }, [checkIfCashClosureNeeded]);
  
  const handleRecovery = () => {
    const lastAction = localStorage.getItem("lastAction");
    if (lastAction) {
      localStorage.setItem("needsRecovery", "false");
      localStorage.setItem("abnormalExit", "false");
      try {
        navigate(lastAction);
        toast.success("Sesión restaurada correctamente");
        
        // After recovering session, check if cash close is needed
        if (checkIfCashClosureNeeded()) {
          setShowCashCloseAlert(true);
        }
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
    
    // Highlight the cash close button
    setTimeout(() => {
      const cashCloseButton = document.querySelector('button:contains("Cierre de caja diario")');
      if (cashCloseButton) {
        cashCloseButton.scrollIntoView({ behavior: 'smooth' });
        cashCloseButton.classList.add('ring', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          cashCloseButton.classList.remove('ring', 'ring-primary', 'ring-offset-2');
        }, 3000);
      }
    }, 500);
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
