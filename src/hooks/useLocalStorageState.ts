
import { useNavigate } from "react-router-dom";

export const useLocalStorageState = () => {
  const navigate = useNavigate();
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    // Only set these values when we actually need recovery
    // For normal navigation, these values should be false
    // localStorage.setItem("needsRecovery", "true");
    // localStorage.setItem("abnormalExit", "true");
  };
  
  const clearRecoveryState = () => {
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
  };
  
  const checkRecoveryNeeded = () => {
    const lastAction = localStorage.getItem("lastAction");
    const needsRecovery = localStorage.getItem("needsRecovery");
    const abnormalExit = localStorage.getItem("abnormalExit");
    
    return abnormalExit === "true" && needsRecovery === "true" && lastAction;
  };
  
  const navigateSafely = (path: string) => {
    // List of routes allowed for recovery
    const validRecoveryPaths = [
      "/dashboard", 
      "/reports", 
      "/cost-center/register",
      "/cost-center/select",
      "/cost-center/reports"
    ];
    
    saveLastAction(path);
    
    // Mark as controlled navigation to prevent issues
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    
    navigate(path, { replace: true });
  };

  return {
    saveLastAction,
    clearRecoveryState,
    checkRecoveryNeeded,
    navigateSafely
  };
};

export default useLocalStorageState;
