
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const useDailyCashClose = () => {
  const [closeSuccessDialogOpen, setCloseSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleDailyCashClose = () => {
    setCloseSuccessDialogOpen(true);
    toast.success("Cierre de caja completado exitosamente");
  };
  
  const handleExitApplication = () => {
    // Mark as normal exit when closing the application through proper dialog
    localStorage.setItem("abnormalExit", "false");
    localStorage.setItem("needsRecovery", "false");
    
    toast.info("Sesión finalizada. La aplicación se cerrará.");
    setTimeout(() => {
      // Log the user out completely
      logout();
      // Redirect to login page
      navigate("/login");
    }, 1500);
  };
  
  return {
    closeSuccessDialogOpen,
    setCloseSuccessDialogOpen,
    handleDailyCashClose,
    handleExitApplication
  };
};

export default useDailyCashClose;
