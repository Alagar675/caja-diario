
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, X, FileText, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showRecoveryAlert, setShowRecoveryAlert] = useState(false);
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  
  // Check for system recovery on component mount
  useEffect(() => {
    const lastAction = localStorage.getItem("lastAction");
    const needsRecovery = localStorage.getItem("needsRecovery");
    
    if (needsRecovery === "true" && lastAction) {
      setShowRecoveryAlert(true);
    }
  }, []);
  
  // Save last action to localStorage
  const saveLastAction = (action: string) => {
    localStorage.setItem("lastAction", action);
    localStorage.setItem("needsRecovery", "true");
  };
  
  // Handle logout process
  const handleLogout = () => {
    setShowLogoutAlert(true);
  };
  
  // Actual logout function
  const performLogout = () => {
    logout();
    localStorage.removeItem("needsRecovery");
    navigate("/login");
  };
  
  // Handle system recovery
  const handleRecovery = () => {
    const lastAction = localStorage.getItem("lastAction");
    if (lastAction) {
      localStorage.setItem("needsRecovery", "false");
      // Redirect to the last action path or perform last action
      try {
        navigate(lastAction);
        toast.success("Sistema restaurado correctamente");
      } catch (error) {
        navigate("/dashboard");
        toast.error("Error al restaurar. Redirigiendo al inicio");
      }
    }
    setShowRecoveryAlert(false);
  };
  
  const cancelRecovery = () => {
    localStorage.setItem("needsRecovery", "false");
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

  // Format user name to capitalize first letter of each word
  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Determine user's gender based on name (simplified approach)
  // In a real application, this would come from the user profile
  const getUserGender = (name: string) => {
    // This is a simplified approach. In a real app, this should be a user property.
    // Common Spanish female name endings, very simplified
    const femaleNamePatterns = ['a', 'ia', 'na', 'ina', 'ela'];
    const lastName = name.split(' ').pop()?.toLowerCase() || '';
    
    for (const pattern of femaleNamePatterns) {
      if (lastName.endsWith(pattern)) {
        return 'female';
      }
    }
    return 'male';
  };

  const formattedName = user ? formatName(user.name) : '';
  const userGender = user ? getUserGender(user.name) : 'male';
  
  // Navigate to reports page
  const goToReports = () => {
    saveLastAction("/reports");
    navigate("/reports");
    setShowLogoutAlert(false);
  };
  
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
              {userGender === 'female' ? (
                <AvatarImage src="/avatar-female.png" alt="Female avatar" />
              ) : (
                <AvatarImage src="/avatar-male.png" alt="Male avatar" />
              )}
              <AvatarFallback className="text-blue-700">{formattedName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-blue-700">
              {formattedName}
            </span>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && <>
              {menuItems.map(item => <a key={item.name} href={item.path} className="text-sm font-medium transition-colors hover:text-primary" onClick={e => {
            e.preventDefault();
            saveLastAction(item.path);
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
                  {userGender === 'female' ? (
                    <AvatarImage src="/avatar-female.png" alt="Female avatar" />
                  ) : (
                    <AvatarImage src="/avatar-male.png" alt="Male avatar" />
                  )}
                  <AvatarFallback className="text-blue-700">{formattedName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-blue-700">
                  {formattedName}
                </span>
              </div>
              {menuItems.map(item => <a key={item.name} href={item.path} className="block py-2 text-base font-medium transition-colors hover:text-primary" onClick={e => {
            e.preventDefault();
            saveLastAction(item.path);
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

      {/* Logout Alert Dialog */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recordatorio Importante</AlertDialogTitle>
            <AlertDialogDescription>
              Antes de salir, debe realizar el cierre de caja diario en la sección de Informes.
              De lo contrario no podrá cerrar la aplicación correctamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Alert className="mt-4 border-yellow-500 bg-yellow-50 text-yellow-800">
            <AlertTitle className="text-yellow-800">¡Atención!</AlertTitle>
            <AlertDescription className="text-yellow-700">
              No realizar el cierre de caja puede causar inconsistencias en sus registros financieros.
            </AlertDescription>
          </Alert>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutAlert(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={goToReports}>Ir a Informes</AlertDialogAction>
            <AlertDialogAction onClick={performLogout}>Salir de todos modos</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* System Recovery Alert Dialog */}
      <AlertDialog open={showRecoveryAlert} onOpenChange={setShowRecoveryAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Sistema</AlertDialogTitle>
            <AlertDialogDescription>
              El sistema se cerró de forma inesperada. ¿Desea restaurar su sesión a la última acción realizada?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRecovery}>No, iniciar de nuevo</AlertDialogCancel>
            <AlertDialogAction onClick={handleRecovery}>Sí, restaurar sistema</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>;
};
export default Navbar;
