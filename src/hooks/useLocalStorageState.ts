
import { useNavigate } from "react-router-dom";

export const useLocalStorageState = () => {
  const navigate = useNavigate();
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    localStorage.setItem("needsRecovery", "true");
    localStorage.setItem("abnormalExit", "true");
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

  return {
    saveLastAction,
    clearRecoveryState,
    checkRecoveryNeeded
  };
};

export default useLocalStorageState;
