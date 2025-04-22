
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CostCenterSelector from "@/components/cost-center/CostCenterSelector";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";

const CostCenterSelect = () => {
  const { selectedCostCenter, getTransactionsByCostCenter } = useFinance();

  const costCenterTransactions = selectedCostCenter 
    ? getTransactionsByCostCenter(selectedCostCenter.id)
    : [];
  
  const totalIncome = costCenterTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = costCenterTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Elegir Centro de Costos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CostCenterSelector />
          
          {selectedCostCenter && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Centro de Costos</CardTitle>
                <CardDescription>{selectedCostCenter.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Total de transacciones:</p>
                    <p className="text-2xl">{costCenterTransactions.length}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total ingresos:</p>
                      <p className="text-xl">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Total egresos:</p>
                      <p className="text-xl">{formatCurrency(totalExpense)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Balance:</p>
                    <p className={`text-2xl ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalIncome - totalExpense)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CostCenterSelect;
