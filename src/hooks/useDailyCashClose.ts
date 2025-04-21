
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
    const closingTimestamp = new Date().toISOString();
    localStorage.setItem("lastCashCloseTime", closingTimestamp);
    localStorage.setItem("needsCashClose", "false");
    
    resetBalancesForNewDay();
    setCloseSuccessDialogOpen(true);
    toast.success("Sistema listo para usar");
  };
  
  const handleExitApplication = () => {
    localStorage.setItem("abnormalExit", "false");
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("needsCashClose", "false");
    
    setTimeout(() => {
      logout();
      navigate("/login");
    }, 1500);
  };
  
  const checkIfCashClosureNeeded = () => {
    return false; // Disabled validation
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
