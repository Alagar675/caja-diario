
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { formatName, getUserGender } from "@/utils/userUtils";
import { useFinance } from "@/context/FinanceContext";
import UserProfileDisplay from "./UserProfileDisplay";
import NavbarMenu from "./NavbarMenu";
import LogoutHandler from "./LogoutHandler";
import RecoveryHandler from "./RecoveryHandler";
import MobileMenu from "./MobileMenu";
import useLocalStorageState from "@/hooks/useLocalStorageState";
import Image from "@/components/ui/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { selectedCostCenter } = useFinance();
  const navigate = useNavigate();
  const { saveLastAction, checkRecoveryNeeded, navigateSafely } = useLocalStorageState();
  
  useEffect(() => {
    if (checkRecoveryNeeded()) {
      setShowRecoveryAlert(true);
    }
  }, [checkRecoveryNeeded]);
  
  const handleLogout = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    localStorage.setItem("abnormalExit", "false");
    setShowLogoutAlert(true);
  };
  
  const closeMenu = () => setIsMenuOpen(false);
  
  const handleLogoClick = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    navigateSafely("/dashboard");
  };
  
  const menuItems = [{
    name: "Inicio",
    path: "/dashboard"
  }, {
    name: selectedCostCenter ? `C.Costos: ${selectedCostCenter.name}` : "C.Costos",
    path: "#",
    submenu: [
      { name: "Registrar centro de costos", path: "/cost-center/register" },
      { name: "Elegir centro de costos", path: "/cost-center/select" },
      { name: "Reportes por centro", path: "/cost-center/reports" }
    ]
  }, {
    name: "Informes",
    path: "/reports"
  }];

  const allMenuItems = isAdmin ? [
    ...menuItems,
    { name: "Administrador", path: "/admin/settings" }
  ] : menuItems;

  const formattedName = user ? formatName(user.name) : '';
  const userGender = user ? getUserGender(user.name) : 'male';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950">
      <div className="container flex h-12 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image 
            src="/lovable-uploads/1dd588be-cbaf-47c8-8924-e510ea18d27f.png" 
            alt="Daily Cash Report Logo" 
            className="h-8 w-8 object-cover cursor-pointer"
            onClick={handleLogoClick}
          />
          <Button
            variant="ghost"
            className="font-bold text-blue-700 text-md"
            onClick={handleLogoClick}
          >
            Daily Cash Report
          </Button>
        </div>

        {user && (
          <UserProfileDisplay 
            name={formattedName}
            gender={userGender as "male" | "female"}
          />
        )}

        <nav className="hidden md:flex items-center space-x-4">
          {user && (
            <>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  navigateSafely("/dashboard");
                }}
                className="text-sm h-8"
              >
                Inicio
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`text-sm flex items-center gap-2 h-8 ${selectedCostCenter ? 'bg-green-50 text-green-700' : ''}`}
                  >
                    <FileText className="h-4 w-4" />
                    {selectedCostCenter ? `C.Costos: ${selectedCostCenter.name.substring(0, 15)}${selectedCostCenter.name.length > 15 ? '...' : ''}` : 'C.Costos'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => navigateSafely("/cost-center/register")}>
                    Registrar centro de costos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateSafely("/cost-center/select")}>
                    Elegir centro de costos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateSafely("/cost-center/reports")}>
                    Reportes por centro
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  navigateSafely("/reports");
                }}
                className="text-sm h-8"
              >
                Informes
              </Button>
              
              <NavbarMenu 
                menuItems={allMenuItems} 
                saveLastAction={saveLastAction} 
                onLogout={handleLogout}
              />
            </>
          )}
          
          {!user && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                onClick={(e) => {
                  e.preventDefault();
                  navigateSafely("/login");
                }} 
                className="text-sm h-8"
              >
                Iniciar sesión
              </Button>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  navigateSafely("/register");
                }} 
                className="text-sm h-8 bg-primary text-white"
              >
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

      <MobileMenu
        isMenuOpen={isMenuOpen}
        user={user}
        formattedName={formattedName}
        userGender={userGender as "male" | "female"}
        menuItems={menuItems}
        saveLastAction={saveLastAction}
        handleLogout={handleLogout}
        closeMenu={closeMenu}
      />

      <LogoutHandler
        showLogoutAlert={showLogoutAlert}
        setShowLogoutAlert={setShowLogoutAlert}
      />

      <RecoveryHandler
        showRecoveryAlert={showRecoveryAlert}
        setShowRecoveryAlert={setShowRecoveryAlert}
      />
    </header>
  );
};

export default Navbar;
