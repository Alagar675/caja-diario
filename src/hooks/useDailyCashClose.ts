
import { useState } from "react";
import { toast } from "sonner";

export const useDailyCashClose = () => {
  const [closeSuccessDialogOpen, setCloseSuccessDialogOpen] = useState(false);
  
  const handleDailyCashClose = () => {
    setCloseSuccessDialogOpen(true);
    toast.success("Cierre de caja completado exitosamente");
  };
  
  const handleExitApplication = () => {
    toast.info("Puede cerrar la aplicación de forma segura.");
  };
  
  return {
    closeSuccessDialogOpen,
    setCloseSuccessDialogOpen,
    handleDailyCashClose,
    handleExitApplication
  };
};

export default useDailyCashClose;
