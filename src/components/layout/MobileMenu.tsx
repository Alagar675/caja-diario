
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import UserProfileDisplay from "./UserProfileDisplay";
import NavbarMenu from "./NavbarMenu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext";

interface MobileMenuProps {
  isMenuOpen: boolean;
  user: any;
  formattedName: string;
  userGender: "male" | "female";
  menuItems: Array<{ 
    name: string; 
    path: string; 
    submenu?: Array<{ name: string; path: string }> 
  }>;
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
  const { selectedCostCenter } = useFinance();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  
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
  
  const toggleExpandedMenu = (name: string) => {
    if (expandedMenu === name) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(name);
    }
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
            
            <div className="flex flex-col space-y-2 pt-2">
              {menuItems.map(item => (
                <div key={item.name} className="w-full">
                  {item.submenu ? (
                    <div className="w-full">
                      <Button
                        variant="ghost"
                        className={`w-full justify-between ${selectedCostCenter && item.name.includes('Centro de Costos') ? 'bg-green-50 text-green-700' : ''}`}
                        onClick={() => toggleExpandedMenu(item.name)}
                      >
                        <div className="flex items-center">
                          {item.name.includes('Centro de Costos') && <FileText className="h-4 w-4 mr-2" />}
                          {item.name}
                        </div>
                        {expandedMenu === item.name ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {expandedMenu === item.name && (
                        <div className="pl-4 ml-2 border-l space-y-1 mt-1">
                          {item.submenu.map(subitem => (
                            <Button
                              key={subitem.name}
                              variant="ghost"
                              className="w-full justify-start text-sm"
                              onClick={(e) => handleNavigation(subitem.path, e)}
                            >
                              {subitem.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={(e) => handleNavigation(item.path, e)}
                    >
                      {item.name}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <NavbarMenu
              menuItems={[]}
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
