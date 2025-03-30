
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import ChangeCalculator from "@/components/calculator/ChangeCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl mb-4 font-bold text-orange-700">Balance financiero del día</h1>
          <Button onClick={() => navigate("/reports")} size="lg" className="flex items-center px-6 bg-green-900 hover:bg-green-800">
            <FileText className="mr-2 h-5 w-5" />
            Generar Informes
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
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
          </div>
          
          <div>
            <ChangeCalculator />
          </div>
        </div>
        
        <div>
          <TransactionList />
        </div>
      </main>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>;
};

export default Dashboard;
