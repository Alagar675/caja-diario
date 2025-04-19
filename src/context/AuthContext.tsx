
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<string>;
  verifyCode: (email: string, code: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "user") => Promise<void>;
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

  const login = async (email: string, password: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Mock login - in a real app, this would be an API call
      if (email && password) {
        // Check if user exists in our mock database
        const usersStr = localStorage.getItem("app_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (!foundUser) {
          throw new Error("Credenciales inválidas");
        }
        
        // Generate verification code (in a real app would be sent via email)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`verification_${email}`, verificationCode);
        
        // In a real app, you would send this code via email
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
      
      // Code is valid, remove it and log in the user
      localStorage.removeItem(`verification_${email}`);
      
      // Get user data
      const usersStr = localStorage.getItem("app_users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const userData = users.find((u: any) => u.email === email);
      
      if (!userData) {
        throw new Error("Usuario no encontrado");
      }
      
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role || "user",
      };
      
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
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
      
      // Mock registration - in a real app, this would be an API call
      if (name && email && password) {
        // Check if email already exists
        const usersStr = localStorage.getItem("app_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        if (users.some((u: any) => u.email === email)) {
          throw new Error("El correo electrónico ya está registrado");
        }
        
        const newUser = {
          id: "user-" + Date.now(),
          name,
          email,
          password, // In a real app, this would be hashed
          role
        };
        
        users.push(newUser);
        localStorage.setItem("app_users", JSON.stringify(users));
        
        // If this is the first user, make them an admin
        if (users.length === 1) {
          newUser.role = "admin";
        }
        
        toast.success("Usuario registrado exitosamente");
        
        // Don't automatically log in when registering a new user from admin panel
        if (user?.role === "admin") {
          return;
        }
        
        localStorage.setItem("user", JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }));
        
        setUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        });
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

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        login,
        verifyCode,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
