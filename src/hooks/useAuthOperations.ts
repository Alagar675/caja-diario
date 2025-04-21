
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Create a temporary user with admin role
      const tempUser: User = {
        id: "temp-" + Date.now(),
        name: "Usuario Temporal",
        email: email,
        role: "admin"
      };
      
      localStorage.setItem("user", JSON.stringify(tempUser));
      setUser(tempUser);
      return email;
      
    } catch (error) {
      toast.error("Error al iniciar sesión: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      
      const userData: User = {
        id: "temp-" + Date.now(),
        name: "Usuario Temporal",
        email: email,
        role: "admin"
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      toast.success("Inicio de sesión exitoso");
      
    } catch (error) {
      toast.error("Error en la verificación: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: "admin" | "user" = "user") => {
    try {
      setIsLoading(true);
      
      const newUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        role: "admin" // Temporarily setting all users as admin
      };
      
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Usuario registrado exitosamente");
      
    } catch (error) {
      toast.error("Error al registrarse: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("app_users");
    setUser(null);
    toast.info("Sesión cerrada");
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    verifyCode,
    register,
    logout
  };
};
