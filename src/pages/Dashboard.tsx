
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardTitle from "@/components/dashboard/DashboardTitle";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import ChangeCalculator from "@/components/calculator/ChangeCalculator";
import EnhancedCurrencyConverter from "@/components/calculator/EnhancedCurrencyConverter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Set default to true to keep sidebar open
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [activeCalculator, setActiveCalculator] = useState<"change" | "currency">("change");

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout onSidebarStateChange={setSidebarOpen} initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <DashboardTitle initialTitle="Bienvenido a Daily Cash Report" />
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
            <div className="col-span-1 md:col-span-8">
              <Tabs 
                defaultValue="income" 
                onValueChange={(value) => setTransactionType(value as "income" | "expense")}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="income">Ingresos</TabsTrigger>
                  <TabsTrigger value="expense">Egresos</TabsTrigger>
                </TabsList>
                <TabsContent value="income">
                  <TransactionForm type="income" />
                </TabsContent>
                <TabsContent value="expense">
                  <TransactionForm type="expense" />
                </TabsContent>
              </Tabs>
              
              <div className="h-6" />
              <TransactionList />
            </div>
            
            <div className="col-span-1 md:col-span-4">
              <Tabs 
                defaultValue="change" 
                onValueChange={(value) => setActiveCalculator(value as "change" | "currency")}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="change">Cambio</TabsTrigger>
                  <TabsTrigger value="currency">Conversor</TabsTrigger>
                </TabsList>
                <TabsContent value="change">
                  <ChangeCalculator isVisible={!sidebarOpen} />
                </TabsContent>
                <TabsContent value="currency">
                  <EnhancedCurrencyConverter isVisible={!sidebarOpen} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default Dashboard;
