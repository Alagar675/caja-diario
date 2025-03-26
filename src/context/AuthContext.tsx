
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock login - in a real app, this would be an API call
      // This is just for demonstration purposes
      if (email && password) {
        const mockUser = {
          id: "user-" + Date.now(),
          name: email.split('@')[0],
          email
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success("Inicio de sesión exitoso");
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

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock registration - in a real app, this would be an API call
      if (name && email && password) {
        const mockUser = {
          id: "user-" + Date.now(),
          name,
          email
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success("Registro exitoso");
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
