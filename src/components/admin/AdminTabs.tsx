
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from "@/components/settings/UserManagement";
import CategoryManagement from "@/components/settings/CategoryManagement";
import CurrencySettings from "@/components/settings/CurrencySettings";

const AdminTabs = () => {
  return (
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
  );
};

export default AdminTabs;
