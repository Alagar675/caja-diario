
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";
import LogoutHandler from "./LogoutHandler";
import RecoveryHandler from "./RecoveryHandler";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import useLocalStorageState from "@/hooks/useLocalStorageState";

import NavbarLogo from "./NavbarLogo";
import NavbarUserSection from "./NavbarUserSection";
import NavbarDesktopMenu from "./NavbarDesktopMenu";

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

  const menuItems = [
    {
      name: "Inicio",
      path: "/dashboard",
    },
    {
      name: selectedCostCenter ? `C.Costos: ${selectedCostCenter.name}` : "C.Costos",
      path: "#",
      submenu: [
        { name: "Registrar centro de costos", path: "/cost-center/register" },
        { name: "Elegir centro de costos", path: "/cost-center/select" },
        { name: "Reportes por centro", path: "/cost-center/reports" },
      ],
    },
    {
      name: "Informes",
      path: "/reports",
    },
  ];

  const formattedName = user ? user.name || "" : "";
  const userGender = user?.gender === "female" ? "female" : "male";

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950">
      <div className="container flex h-12 items-center justify-between">
        <NavbarLogo onLogoClick={handleLogoClick} />

        <NavbarUserSection user={user} formattedName={formattedName} userGender={userGender} />

        <nav className="hidden md:flex items-center space-x-4">
          <NavbarDesktopMenu
            user={user}
            isAdmin={isAdmin}
            selectedCostCenter={selectedCostCenter}
            menuItems={menuItems}
            saveLastAction={saveLastAction}
            onLogout={handleLogout}
          />
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
        userGender={userGender}
        menuItems={menuItems}
        saveLastAction={saveLastAction}
        handleLogout={handleLogout}
        closeMenu={closeMenu}
      />

      <LogoutHandler showLogoutAlert={showLogoutAlert} setShowLogoutAlert={setShowLogoutAlert} />

      <RecoveryHandler showRecoveryAlert={showRecoveryAlert} setShowRecoveryAlert={setShowRecoveryAlert} />
    </header>
  );
};

export default Navbar;
