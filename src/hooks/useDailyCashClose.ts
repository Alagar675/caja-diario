
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";

export const useDailyCashClose = () => {
  const [closeSuccessDialogOpen, setCloseSuccessDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { resetBalancesForNewDay } = useFinance();
  
  const handleDailyCashClose = () => {
    // Store the closing time to track when cash was last closed
    const closingTimestamp = new Date().toISOString();
    localStorage.setItem("lastCashCloseTime", closingTimestamp);
    localStorage.setItem("needsCashClose", "false");
    
    // Reset all current balances while preserving transaction history
    resetBalancesForNewDay();
    
    setCloseSuccessDialogOpen(true);
    toast.success("Cierre de caja completado exitosamente");
    
    // Redirigir al dashboard después del cierre
    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
  };
  
  const handleExitApplication = () => {
    // Mark as normal exit when closing the application through proper dialog
    localStorage.setItem("abnormalExit", "false");
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("needsCashClose", "false");
    
    toast.info("Sesión finalizada. La aplicación se cerrará.");
    setTimeout(() => {
      // Log the user out completely
      logout();
      // Redirect to login page with replace to evitar problemas de historial
      navigate("/login", { replace: true });
    }, 1500);
  };
  
  const checkIfCashClosureNeeded = () => {
    const needsCashClose = localStorage.getItem("needsCashClose");
    const lastCloseTime = localStorage.getItem("lastCashCloseTime");
    const now = new Date();
    const lastCloseDate = lastCloseTime ? new Date(lastCloseTime) : null;
    
    // If no previous close or it was a different day than today
    if (!lastCloseDate || !isSameDay(lastCloseDate, now)) {
      // Check if within business hours (7am to 7pm)
      const hour = now.getHours();
      const isBusinessHours = hour >= 7 && hour < 19; 
      
      if (needsCashClose === "true" && isBusinessHours) {
        return true;
      }
    }
    
    return false;
  };
  
  // Helper function to check if two dates are on the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };
  
  return {
    closeSuccessDialogOpen,
    setCloseSuccessDialogOpen,
    handleDailyCashClose,
    handleExitApplication,
    checkIfCashClosureNeeded
  };
};

export default useDailyCashClose;
