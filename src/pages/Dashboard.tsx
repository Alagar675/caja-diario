
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold mb-4">Dashboard Financiero</h1>
          <Button 
            onClick={() => navigate("/reports")} 
            className="flex items-center px-6"
            size="lg"
          >
            <FileText className="mr-2 h-5 w-5" />
            Generar Informes
          </Button>
        </div>
        
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
