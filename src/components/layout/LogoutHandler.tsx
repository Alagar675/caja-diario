
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutAlert from "./LogoutAlert";

interface LogoutHandlerProps {
  showLogoutAlert: boolean;
  setShowLogoutAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogoutHandler = ({ showLogoutAlert, setShowLogoutAlert }: LogoutHandlerProps) => {
  const navigate = useNavigate();

  const handleCancel = () => setShowLogoutAlert(false);
  
  const goToReports = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    navigate("/reports", { replace: true });
    setShowLogoutAlert(false);
    
    setTimeout(() => {
      // Fix for the invalid selector error
      const dailyCashCloseButtons = document.querySelectorAll('button');
      let cashCloseButton = null;
      
      // Find button with text content "Cierre de caja diario"
      dailyCashCloseButtons.forEach(button => {
        if (button.textContent && button.textContent.includes("Cierre de caja diario")) {
          cashCloseButton = button;
        }
      });
      
      if (cashCloseButton) {
        cashCloseButton.classList.add('ring', 'ring-primary', 'ring-offset-2');
        cashCloseButton.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          cashCloseButton.classList.remove('ring', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 500);
  };
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    localStorage.setItem("needsRecovery", "false"); // No necesitamos recuperación cuando usamos navegación controlada
    localStorage.setItem("abnormalExit", "false"); // Marcamos como salida normal
  };

  return (
    <LogoutAlert
      open={showLogoutAlert}
      onOpenChange={setShowLogoutAlert}
      onCancel={handleCancel}
      onGoToReports={goToReports}
      onPerformLogout={goToReports}
    />
  );
};

export default LogoutHandler;
