
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const closeMenu = () => setIsMenuOpen(false);
  
  const menuItems = [
    { name: "Inicio", path: "/dashboard" },
    { name: "Informes", path: "/reports" }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-white/90 dark:bg-dark/90 border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-blue-700 text-xl">D'pagos movil</span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <>
              {menuItems.map(item => (
                <a 
                  key={item.name} 
                  href={item.path} 
                  className="text-sm font-medium transition-colors hover:text-primary" 
                  onClick={e => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  Hola, {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            </>
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

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-border", isMenuOpen ? "block animate-slide-in" : "hidden")}>
        <div className="container py-4 space-y-4">
          {user && (
            <>
              {menuItems.map(item => (
                <a 
                  key={item.name} 
                  href={item.path} 
                  className="block py-2 text-base font-medium transition-colors hover:text-primary" 
                  onClick={e => {
                    e.preventDefault();
                    navigate(item.path);
                    closeMenu();
                  }}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t">
                <span className="text-sm font-medium py-2">
                  Hola, {user.name}
                </span>
                <Button variant="outline" onClick={handleLogout} className="justify-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar sesión</span>
                </Button>
              </div>
            </>
          )}
          {!user && (
            <div className="flex flex-col space-y-2">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
