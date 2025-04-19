
import React, { createContext, useContext, ReactNode } from "react";
import { AuthContextType, User } from "@/types/auth";
import { useAuthOperations } from "@/hooks/useAuthOperations";
import { useAuthInit } from "@/hooks/useAuthInit";

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
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    verifyCode,
    register,
    logout
  } = useAuthOperations();

  useAuthInit(setUser, setIsLoading);

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
