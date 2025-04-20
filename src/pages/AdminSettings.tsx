
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import UserManagement from "@/components/settings/UserManagement";
import CategoryManagement from "@/components/settings/CategoryManagement";
import CurrencySettings from "@/components/settings/CurrencySettings";
import { Users } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Panel de Administrador</h1>
          </div>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
              <TabsTrigger value="categories">Gestión de Categorías</TabsTrigger>
              <TabsTrigger value="currency">Configuración de Divisas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="currency" className="space-y-4">
              <CurrencySettings />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </div>
  );
};

export default AdminSettings;

