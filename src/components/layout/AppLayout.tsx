
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
  onSidebarStateChange?: (isOpen: boolean) => void;
  initialSidebarOpen?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showSidebar = true,
  className,
  onSidebarStateChange,
  initialSidebarOpen = false
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(initialSidebarOpen);
  
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    if (onSidebarStateChange) {
      onSidebarStateChange(newState);
    }
  };
  
  const handleSidebarStateChange = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
    
    if (onSidebarStateChange) {
      onSidebarStateChange(isOpen);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full bg-background">
        <Navbar />
        <div className="flex flex-1 w-full overflow-hidden">
          <main className={cn("flex-1 w-full overflow-y-auto", className)}>
            {children}
          </main>
          
          {showSidebar && (
            <Sidebar 
              isOpen={sidebarOpen} 
              toggleSidebar={toggleSidebar} 
              onSidebarStateChange={handleSidebarStateChange}
            />
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
