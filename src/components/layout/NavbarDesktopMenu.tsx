
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import NavbarMenu from "./NavbarMenu";
import { FileText } from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  submenu?: Array<{name: string; path: string;}>;
}

interface NavbarDesktopMenuProps {
  user: any;
  isAdmin: boolean;
  selectedCostCenter: any;
  menuItems: MenuItem[];
  saveLastAction: (action: string) => void;
  onLogout: (event?: React.MouseEvent) => void;
}

const NavbarDesktopMenu = ({
  user,
  isAdmin,
  selectedCostCenter,
  menuItems,
  saveLastAction,
  onLogout,
}: NavbarDesktopMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (path === "#") return; // Don't navigate for dropdown triggers
    
    // Mark navigation as controlled to prevent issues
    saveLastAction(path);
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    
    // Use navigate with replace to avoid history stack issues
    navigate(path, { replace: true });
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("/login");
          }}
          className="text-sm h-8"
        >
          Iniciar sesión
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("/register");
          }}
          className="text-sm h-8 bg-primary text-white"
        >
          Registrarse
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate("/dashboard");
        }}
        className="text-sm h-8"
      >
        Inicio
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`text-sm flex items-center gap-2 h-8 ${
              selectedCostCenter ? "bg-green-50 text-green-700" : ""
            }`}
          >
            <FileText className="h-4 w-4" />
            {selectedCostCenter
              ? `C.Costos: ${selectedCostCenter.name.substring(
                  0,
                  15
                )}${selectedCostCenter.name.length > 15 ? "..." : ""}`
              : "C.Costos"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={() => handleNavigate("/cost-center/register")}>
            Registrar centro de costos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate("/cost-center/select")}>
            Elegir centro de costos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate("/cost-center/reports")}>
            Reportes por centro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        onClick={(e) => {
          e.preventDefault();
          handleNavigate("/reports");
        }}
        className="text-sm h-8"
      >
        Informes
      </Button>

      {isAdmin && (
        <Button
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate("/admin/settings");
          }}
          className="text-sm h-8"
        >
          Administrador
        </Button>
      )}

      <NavbarMenu
        menuItems={[]}
        saveLastAction={saveLastAction}
        onLogout={onLogout}
      />
    </>
  );
};

export default NavbarDesktopMenu;
