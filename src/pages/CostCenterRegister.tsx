
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CostCenterRegisterForm from "@/components/cost-center/CostCenterRegisterForm";

const CostCenterRegister = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Registrar Centro de Costos</h1>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Crear un nuevo Centro de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <CostCenterRegisterForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CostCenterRegister;
