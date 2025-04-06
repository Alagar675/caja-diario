import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { formatName, getUserGender } from "@/utils/userUtils";
import { toast } from "sonner";
import UserProfileDisplay from "./UserProfileDisplay";
import NavbarMenu from "./NavbarMenu";
import LogoutAlert from "./LogoutAlert";
import RecoveryAlert from "./RecoveryAlert";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const lastAction = localStorage.getItem("lastAction");
    const needsRecovery = localStorage.getItem("needsRecovery");
    const abnormalExit = localStorage.getItem("abnormalExit");
    
    if (abnormalExit === "true" && needsRecovery === "true" && lastAction) {
      setShowRecoveryAlert(true);
    }
  }, []);
  
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    localStorage.setItem("needsRecovery", "true");
    localStorage.setItem("abnormalExit", "true");
  };
  
  const handleLogout = () => {
    localStorage.setItem("abnormalExit", "false");
    setShowLogoutAlert(true);
  };
  
  const performLogout = () => {
    localStorage.setItem("abnormalExit", "false");
    localStorage.removeItem("needsRecovery");
    logout();
    navigate("/login");
  };
  
  const handleRecovery = () => {
    const lastAction = localStorage.getItem("lastAction");
    if (lastAction) {
      localStorage.setItem("needsRecovery", "false");
      localStorage.setItem("abnormalExit", "false");
      try {
        navigate(lastAction);
        toast.success("Sesión restaurada correctamente");
      } catch (error) {
        navigate("/dashboard");
        toast.error("Error al restaurar. Redirigiendo al inicio");
      }
    }
    setShowRecoveryAlert(false);
  };
  
  const cancelRecovery = () => {
    localStorage.setItem("needsRecovery", "false");
    localStorage.setItem("abnormalExit", "false");
    setShowRecoveryAlert(false);
    navigate("/login");
  };
  
  const closeMenu = () => setIsMenuOpen(false);
  
  const menuItems = [{
    name: "Inicio",
    path: "/dashboard"
  }, {
    name: "Informes",
    path: "/reports"
  }];

  const formattedName = user ? formatName(user.name) : '';
  const userGender = user ? getUserGender(user.name) : 'male';
  
  const goToReports = () => {
    saveLastAction("/reports");
    navigate("/reports");
    setShowLogoutAlert(false);
    
    setTimeout(() => {
      const dailyCashCloseButton = document.querySelector('button:has(.h-4.w-4 + span:contains("Cierre de caja diario"))');
      if (dailyCashCloseButton) {
        dailyCashCloseButton.scrollIntoView({ behavior: 'smooth' });
        dailyCashCloseButton.classList.add('ring', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          dailyCashCloseButton.classList.remove('ring', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 500);
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-blue-700 text-xl">Daily Cash Report</span>
          </a>
        </div>

        {user && (
          <UserProfileDisplay 
            name={formattedName}
            gender={userGender as "male" | "female"}
          />
        )}

        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <NavbarMenu 
              menuItems={menuItems} 
              saveLastAction={saveLastAction} 
              onLogout={handleLogout}
            />
          )}
          
          {!user && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm">
                Iniciar sesión
              </Button>
              <Button onClick={() => navigate("/register")} className="text-sm bg-primary text-white">
                Registrarse
              </Button>
            </div>
          )}
        </nav>

        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn(
        "md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-border z-40", 
        isMenuOpen ? "block animate-slide-in" : "hidden"
      )}>
        <div className="container py-4 space-y-4">
          {user && (
            <>
              <UserProfileDisplay 
                name={formattedName} 
                gender={userGender as "male" | "female"} 
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
                onClick={() => {
                  navigate("/login");
                  closeMenu();
                }} 
                className="justify-center"
              >
                Iniciar sesión
              </Button>
              <Button 
                onClick={() => {
                  navigate("/register");
                  closeMenu();
                }} 
                className="justify-center bg-primary text-white"
              >
                Registrarse
              </Button>
            </div>
          )}
        </div>
      </div>

      <LogoutAlert
        open={showLogoutAlert}
        onOpenChange={setShowLogoutAlert}
        onCancel={() => setShowLogoutAlert(false)}
        onGoToReports={goToReports}
        onPerformLogout={goToReports}
      />

      <RecoveryAlert
        open={showRecoveryAlert}
        onOpenChange={setShowRecoveryAlert}
        onCancel={cancelRecovery}
        onRecover={handleRecovery}
      />
    </header>
  );
};

export default Navbar;
