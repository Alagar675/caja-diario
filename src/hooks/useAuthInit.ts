
import { useEffect } from "react";
import { User } from "@/types/auth";

export const useAuthInit = (setUser: (user: User | null) => void, setIsLoading: (loading: boolean) => void) => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    
    const usersStr = localStorage.getItem("app_users");
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.length === 0) {
      const adminUser = {
        id: "user-admin-" + Date.now(),
        name: "Alirio Aguirre Ariza",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      };
      
      localStorage.setItem("app_users", JSON.stringify([adminUser]));
      console.log("Default admin user created");
    }
    
    setIsLoading(false);
  }, [setUser, setIsLoading]);
};
