import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formatName, getUserGender } from "@/utils/userUtils";
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
  const navigate = useNavigate();
  const { saveLastAction, checkRecoveryNeeded } = useLocalStorageState();
  
  useEffect(() => {
    if (checkRecoveryNeeded()) {
      setShowRecoveryAlert(true);
    }
  }, [checkRecoveryNeeded]);
  
  const handleLogout = () => {
    localStorage.setItem("abnormalExit", "false");
    setShowLogoutAlert(true);
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
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image 
            src="/lovable-uploads/b256ddc8-8d54-47ff-81a7-e14b2f25201e.png" 
            alt="Daily Cash Report Logo" 
            className="h-10 w-10 object-cover"
          />
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
