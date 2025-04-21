import { useState } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useAuthOperations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userData: User = {
          id: data.user.id,
          name: profile?.full_name || data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          role: "admin"
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return userData.email;
      }
      throw new Error("No user data returned");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message === "Invalid login credentials") {
        toast.error("Credenciales inválidas");
      } else {
        toast.error("Error al iniciar sesión: " + error.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email'
      });

      if (error) throw error;
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          name: data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          role: "admin"
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Inicio de sesión exitoso");
      }
    } catch (error) {
      toast.error("Error en la verificación: " + (error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
      
      if (existingUsers && existingUsers.length > 0) {
        throw { code: "user_already_exists", message: "Usuario ya registrado" };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          role: "admin"
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Usuario registrado exitosamente");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem("user");
      localStorage.removeItem("app_users");
      setUser(null);
      toast.info("Sesión cerrada");
    } catch (error) {
      toast.error("Error al cerrar sesión: " + (error as Error).message);
    }
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
