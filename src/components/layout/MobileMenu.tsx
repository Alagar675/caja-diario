
import React from "react";
import { cn } from "@/lib/utils";
import UserProfileDisplay from "./UserProfileDisplay";
import NavbarMenu from "./NavbarMenu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MobileMenuProps {
  isMenuOpen: boolean;
  user: any;
  formattedName: string;
  userGender: "male" | "female";
  menuItems: Array<{ name: string; path: string }>;
  saveLastAction: (action: string) => void;
  handleLogout: (event?: React.MouseEvent) => void;
  closeMenu: () => void;
}

const MobileMenu = ({
  isMenuOpen,
  user,
  formattedName,
  userGender,
  menuItems,
  saveLastAction,
  handleLogout,
  closeMenu,
}: MobileMenuProps) => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    
    saveLastAction(path);
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    navigate(path, { replace: true });
    closeMenu();
  };

  return (
    <div
      className={cn(
        "md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-border z-40",
        isMenuOpen ? "block animate-slide-in" : "hidden"
      )}
    >
      <div className="container py-4 space-y-4">
        {user && (
          <>
            <UserProfileDisplay
              name={formattedName}
              gender={userGender}
              isMobile={true}
            />
            <NavbarMenu
              menuItems={menuItems}
              saveLastAction={saveLastAction}
              onLogout={handleLogout}
              isMobile={true}
              closeMenu={closeMenu}
            />
          </>
        )}

        {!user && (
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              onClick={(e) => handleNavigation("/login", e)}
              className="justify-center"
            >
              Iniciar sesión
            </Button>
            <Button
              onClick={(e) => handleNavigation("/register", e)}
              className="justify-center bg-primary text-white"
            >
              Registrarse
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
