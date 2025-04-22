
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
    
    // Guardar la acción pero marcar como salida normal
    saveLastAction(path);
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    
    // Usar navigate con replace para evitar problemas de historial
    navigate(path, { replace: true });
    
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  const allMenuItems = isAdmin ? [
    ...menuItems,
    { name: "Administrador", path: "/admin/settings" }
  ] : menuItems;

  return (
    <>
      {allMenuItems.map(item => (
        <Button
          key={item.name}
          variant="ghost"
          className={isMobile ? "w-full justify-start" : "h-8"}
          onClick={(e) => handleNavigation(item.path, e)}
        >
          {item.name}
        </Button>
      ))}
      
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
