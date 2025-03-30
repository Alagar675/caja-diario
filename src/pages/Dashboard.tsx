
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import ChangeCalculator from "@/components/calculator/ChangeCalculator";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarStateChange = (isOpen: boolean) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-1 md:col-span-8">
            <TransactionForm />
            <div className="h-6" />
            <TransactionList />
          </div>
          
          <div className="col-span-1 md:col-span-4">
            <ChangeCalculator isVisible={!sidebarOpen} />
          </div>
        </div>
      </main>
      
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onSidebarStateChange={handleSidebarStateChange}
      />
    </div>
  );
};

export default Dashboard;
