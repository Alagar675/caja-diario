
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface NavbarMenuProps {
  menuItems: Array<{ name: string; path: string }>;
  saveLastAction: (action: string) => void;
  onLogout: () => void;
  isMobile?: boolean;
  closeMenu?: () => void;
}

const NavbarMenu = ({ menuItems, saveLastAction, onLogout, isMobile = false, closeMenu }: NavbarMenuProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    // Mark as controlled navigation to prevent issues
    saveLastAction(path);
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    
    // Use navigate with replace to avoid history stack issues
    navigate(path, { replace: true });
    
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };
  
  return (
    <>
      <div className={isMobile ? "flex flex-col space-y-2 pt-2 border-t" : "flex items-center space-x-2"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => handleNavigation("/settings/currency", e)}
          title="Configuración de moneda"
          className={isMobile ? "" : "h-8 w-8"}
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button 
          variant={isMobile ? "outline" : "outline"} 
          size={isMobile ? "default" : "sm"}
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }} 
          className={isMobile ? "justify-start" : "flex items-center gap-1 h-8"}
        >
          <LogOut className="h-4 w-4" />
          <span>{isMobile ? "Cerrar sesión" : "Salir"}</span>
        </Button>
      </div>
    </>
  );
};

export default NavbarMenu;
