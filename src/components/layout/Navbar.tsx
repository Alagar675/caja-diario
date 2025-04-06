
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, FileText, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
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
  return <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm dark:bg-gray-950">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-blue-700 text-xl">Daily Cash Report</span>
          </a>
        </div>

        {/* User Profile Display in Center */}
        {user && (
          <div className="hidden md:flex items-center justify-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <Avatar className="h-8 w-8 bg-blue-200">
              <AvatarFallback className="text-blue-700">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-blue-700">
              {user.name}
            </span>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && <>
              {menuItems.map(item => <a key={item.name} href={item.path} className="text-sm font-medium transition-colors hover:text-primary" onClick={e => {
            e.preventDefault();
            navigate(item.path);
          }}>
                  {item.name}
                </a>)}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            </>}
          {!user && <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm">
                Iniciar sesión
              </Button>
              <Button onClick={() => navigate("/register")} className="text-sm bg-primary text-white">
                Registrarse
              </Button>
            </div>}
        </nav>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-border z-40", isMenuOpen ? "block animate-slide-in" : "hidden")}>
        <div className="container py-4 space-y-4">
          {user && <>
              {/* Mobile User Profile Display */}
              <div className="flex items-center space-x-2 py-2 mb-2 justify-center">
                <Avatar className="h-8 w-8 bg-blue-200">
                  <AvatarFallback className="text-blue-700">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-blue-700">
                  {user.name}
                </span>
              </div>
              {menuItems.map(item => <a key={item.name} href={item.path} className="block py-2 text-base font-medium transition-colors hover:text-primary" onClick={e => {
            e.preventDefault();
            navigate(item.path);
            closeMenu();
          }}>
                  {item.name}
                </a>)}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <Button variant="outline" onClick={handleLogout} className="justify-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            </>}
          {!user && <div className="flex flex-col space-y-2">
              <Button variant="ghost" onClick={() => {
            navigate("/login");
            closeMenu();
          }} className="justify-center">
                Iniciar sesión
              </Button>
              <Button onClick={() => {
            navigate("/register");
            closeMenu();
          }} className="justify-center bg-primary text-white">
                Registrarse
              </Button>
            </div>}
        </div>
      </div>
    </header>;
};
export default Navbar;
