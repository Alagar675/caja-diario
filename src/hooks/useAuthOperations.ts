
import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      if (email && password) {
        const usersStr = localStorage.getItem("app_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (!foundUser) {
          throw new Error("Credenciales inválidas");
        }
        
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`verification_${email}`, verificationCode);
        
        toast.info(`Código de verificación generado: ${verificationCode}`, {
          description: "En una aplicación real, este código sería enviado por correo electrónico"
        });
        
        return email;
      } else {
        throw new Error("Email y contraseña son requeridos");
      }
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
      
      const storedCode = localStorage.getItem(`verification_${email}`);
      
      if (!storedCode || storedCode !== code) {
        throw new Error("Código de verificación inválido");
      }
      
      localStorage.removeItem(`verification_${email}`);
      
      const usersStr = localStorage.getItem("app_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userData = users.find((u: any) => u.email === email);
      
      if (!userData) {
        throw new Error("Usuario no encontrado");
      }
      
      const authenticatedUser = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
      };
      
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
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
      
      if (name && email && password) {
        const usersStr = localStorage.getItem("app_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        if (users.some((u: any) => u.email === email)) {
          throw new Error("El correo electrónico ya está registrado");
        }
        
        const newUser = {
          id: "user-" + Date.now(),
          name,
          email,
          password,
          role
        };
        
        users.push(newUser);
        localStorage.setItem("app_users", JSON.stringify(users));
        
        if (users.length === 1) {
          newUser.role = "admin";
        }
        
        toast.success("Usuario registrado exitosamente");
        
        if (user?.role === "admin") {
          return;
        }
        
        const authenticatedUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        };
        
        localStorage.setItem("user", JSON.stringify(authenticatedUser));
        setUser(authenticatedUser);
      } else {
        throw new Error("Todos los campos son requeridos");
      }
    } catch (error) {
      toast.error("Error al registrarse: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
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
