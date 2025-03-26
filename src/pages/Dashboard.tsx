
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="space-y-8">
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="income" className="w-1/2">Ingresos</TabsTrigger>
              <TabsTrigger value="expense" className="w-1/2">Egresos</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <TabsContent value="income" className="space-y-8">
                <TransactionForm type="income" />
              </TabsContent>
              <TabsContent value="expense" className="space-y-8">
                <TransactionForm type="expense" />
              </TabsContent>
            </div>
          </Tabs>
          
          <div>
            <TransactionList />
          </div>
        </div>
      </main>

      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
    </div>
  );
};

export default Dashboard;
