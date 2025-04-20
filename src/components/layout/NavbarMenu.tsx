
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useLocalStorageState from "@/hooks/useLocalStorageState";
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
  const { clearRecoveryState } = useLocalStorageState();
  const { isAdmin } = useAuth();

  const handleNavigation = (path: string) => {
    saveLastAction(path);
    clearRecoveryState();
    navigate(path);
    if (isMobile && closeMenu) {
      closeMenu();
    }
  };

  const allMenuItems = isAdmin ? [
    ...menuItems,
    { name: "Panel de Administrador", path: "/admin/settings" }
  ] : menuItems;

  return (
    <>
      {allMenuItems.map(item => (
        <a
          key={item.name}
          href={item.path}
          className={isMobile ? "block py-2 text-base font-medium transition-colors hover:text-primary" : "text-sm font-medium transition-colors hover:text-primary"}
          onClick={(e) => {
            e.preventDefault();
            handleNavigation(item.path);
          }}
        >
          {item.name}
        </a>
      ))}
      
      <div className={isMobile ? "flex flex-col space-y-2 pt-2 border-t" : "flex items-center space-x-2"}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigation("/settings/currency")}
          title="Configuración de moneda"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          variant={isMobile ? "outline" : "outline"} 
          size={isMobile ? "default" : "sm"}
          onClick={onLogout} 
          className={isMobile ? "justify-center" : "flex items-center gap-1"}
        >
          <LogOut className="h-4 w-4" />
          <span>{isMobile ? "Cerrar sesión" : "Salir"}</span>
        </Button>
      </div>
    </>
  );
};

export default NavbarMenu;
