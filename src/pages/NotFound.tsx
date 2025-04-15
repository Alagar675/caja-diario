
import React from "react";
import AppLayout from "@/components/layout/AppLayout";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <AppLayout showSidebar={false}>
        <div className="container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold">Página no encontrada</h1>
          <p className="mt-4">Lo sentimos, la página que buscas no existe.</p>
        </div>
      </AppLayout>
    </div>
  );
};

export default NotFound;
