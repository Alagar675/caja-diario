
import { useNavigate } from "react-router-dom";

export const useLocalStorageState = () => {
  const navigate = useNavigate();
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    // Solo configuramos estos valores si realmente necesitamos recuperación
    // Para navegación normal, estos valores deberían ser false
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
    saveLastAction(path);
    clearRecoveryState(); // Asegurarnos que la navegación sea normal
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
