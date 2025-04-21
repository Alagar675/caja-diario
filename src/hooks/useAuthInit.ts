
import { useEffect } from "react";
import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

export const useAuthInit = (setUser: (user: User | null) => void, setIsLoading: (loading: boolean) => void) => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userData: User = {
            id: session.user.id,
            name: profile?.full_name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: "admin"
          };
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userData: User = {
          id: session.user.id,
          name: profile?.full_name || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: "admin"
        };
        setUser(userData);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);
};
