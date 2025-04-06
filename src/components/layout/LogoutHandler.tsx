
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
  
  const goToReports = () => {
    saveLastAction("/reports");
    navigate("/reports");
    setShowLogoutAlert(false);
    
    setTimeout(() => {
      const dailyCashCloseButton = document.querySelector('button:has(.h-4.w-4 + span:contains("Cierre de caja diario"))');
      if (dailyCashCloseButton) {
        dailyCashCloseButton.classList.add('ring', 'ring-primary', 'ring-offset-2');
        dailyCashCloseButton.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          dailyCashCloseButton.classList.remove('ring', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 500);
  };
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    localStorage.setItem("needsRecovery", "true");
    localStorage.setItem("abnormalExit", "true");
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
