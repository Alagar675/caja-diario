
import { useEffect } from "react";
import { User } from "@/types/auth";

export const useAuthInit = (setUser: (user: User | null) => void, setIsLoading: (loading: boolean) => void) => {
  useEffect(() => {
    // Clear any existing users data
    localStorage.removeItem("app_users");
    
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
  }, [setUser, setIsLoading]);
};
