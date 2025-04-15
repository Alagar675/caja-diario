
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardTitle from "@/components/dashboard/DashboardTitle";

const Index = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout showSidebar={false}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <DashboardTitle initialTitle="Bienvenido a Daily Cash Report" />
          
          <div className="mt-8 grid gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4 text-center">Gestión diaria de caja</h2>
              <p className="text-gray-600">
                Esta aplicación le permite administrar y controlar el flujo de efectivo diario,
                registrar transacciones y generar informes detallados de sus operaciones financieras.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h2 className="text-xl font-semibold mb-4 text-center">¿Cómo empezar?</h2>
              <p className="text-gray-600 mb-4">
                Puede comenzar navegando a alguna de las siguientes secciones:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                  <h3 className="font-medium text-blue-700 mb-2">Panel principal</h3>
                  <p className="text-sm text-gray-600">
                    Visualice resúmenes de ingresos, egresos y balance del día actual.
                  </p>
                </div>
                <div className="bg-green-50 rounded-md p-4 border border-green-100">
                  <h3 className="font-medium text-green-700 mb-2">Informes</h3>
                  <p className="text-sm text-gray-600">
                    Genere y consulte informes detallados de las operaciones financieras.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default Index;
