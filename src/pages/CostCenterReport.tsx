
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { generatePDF, printDocument } from "@/utils/formatters";

const CostCenterReport = () => {
  const { costCenters, getTransactionsByCostCenter } = useFinance();
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<"print" | "pdf">("print");

  const selectedCenter = costCenters.find(cc => cc.id === selectedCenterId);
  const transactions = selectedCenterId ? getTransactionsByCostCenter(selectedCenterId) : [];
  
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const incomeByCategory = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
  const expenseByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const generateReport = () => {
    if (!selectedCenter) return;
    
    const reportDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });
    const printDateTime = format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: es });
    
    const reportContent = `
      <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative;">
        <div style="position: absolute; top: 20px; right: 20px; font-size: 12px; color: #666;">
          Impreso: ${printDateTime}
        </div>
        <h1 style="text-align: center;">Reporte de Centro de Costos</h1>
        <h2 style="text-align: center;">${selectedCenter.name}</h2>
        <p style="text-align: center;">${selectedCenter.description || ''}</p>
        <h3 style="text-align: center;">Fecha del reporte: ${reportDate}</h3>
        
        <div style="margin-top: 20px;">
          <h3>Resumen financiero</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Concepto</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Monto</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Total ingresos</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(totalIncome)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Total egresos</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(totalExpense)}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Balance</strong></td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(totalIncome - totalExpense)}</strong></td>
            </tr>
          </table>
        </div>
        
        <div style="margin-top: 20px; display: flex; justify-content: space-between;">
          <div style="width: 48%;">
            <h3>Ingresos por categoría</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Categoría</th>
                <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
              </tr>
              ${Object.entries(incomeByCategory).map(([cat, total]) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${cat}</td>
                  <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(total)}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div style="width: 48%;">
            <h3>Egresos por categoría</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Categoría</th>
                <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
              </tr>
              ${Object.entries(expenseByCategory).map(([cat, total]) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${cat}</td>
                  <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(total)}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
        
        <div style="margin-top: 30px;">
          <h3>Detalle de transacciones</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Fecha</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Tipo</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Categoría</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Descripción</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Monto</th>
            </tr>
            ${transactions.map(t => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${format(t.date, 'dd/MM/yyyy')}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${t.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${t.category}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${t.description}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(t.amount)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>Generado el ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm:ss", { locale: es })}</p>
        </div>
      </div>
    `;
    
    if (outputFormat === "print") {
      printDocument(reportContent);
    } else {
      generatePDF(reportContent, `reporte-centro-costos-${selectedCenter.name.replace(/\s+/g, '-')}.pdf`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Reportes de Centro de Costos</h1>

        <Card className="w-full mb-6">
          <CardHeader>
            <CardTitle>Generar Informe de Centro de Costos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Seleccionar Centro de Costos</p>
              <Select value={selectedCenterId || ""} onValueChange={setSelectedCenterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un centro de costos" />
                </SelectTrigger>
                <SelectContent>
                  {costCenters.map(cc => (
                    <SelectItem key={cc.id} value={cc.id}>{cc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Formato de salida</p>
              <div className="flex space-x-2">
                <Button
                  variant={outputFormat === "print" ? "default" : "outline"}
                  onClick={() => setOutputFormat("print")}
                  className="flex-1"
                >
                  Imprimir
                </Button>
                <Button
                  variant={outputFormat === "pdf" ? "default" : "outline"}
                  onClick={() => setOutputFormat("pdf")}
                  className="flex-1"
                >
                  PDF
                </Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              disabled={!selectedCenterId} 
              onClick={generateReport}
            >
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        {selectedCenter && (
          <Card>
            <CardHeader>
              <CardTitle>Vista previa del reporte: {selectedCenter.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Total ingresos</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Total egresos</p>
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${totalIncome - totalExpense >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
                    <p className={`text-sm font-medium ${totalIncome - totalExpense >= 0 ? 'text-blue-800' : 'text-amber-800'}`}>Balance</p>
                    <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                      {formatCurrency(totalIncome - totalExpense)}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Transacciones ({transactions.length})</h3>
                  {transactions.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted">
                            <th className="text-left py-2 px-3">Fecha</th>
                            <th className="text-left py-2 px-3">Tipo</th>
                            <th className="text-left py-2 px-3">Categoría</th>
                            <th className="text-right py-2 px-3">Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice(0, 5).map(t => (
                            <tr key={t.id} className="border-t">
                              <td className="py-2 px-3">{format(t.date, 'dd/MM/yyyy')}</td>
                              <td className="py-2 px-3">{t.type === 'income' ? 'Ingreso' : 'Egreso'}</td>
                              <td className="py-2 px-3">{t.category}</td>
                              <td className="py-2 px-3 text-right">{formatCurrency(t.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {transactions.length > 5 && (
                        <div className="text-center p-2 bg-muted text-sm">
                          Y {transactions.length - 5} transacciones más
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay transacciones para este centro de costos</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CostCenterReport;
