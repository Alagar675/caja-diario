
import React, { useState } from "react";
import { Calendar, FileText, Printer, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, printDocument, generatePDF } from "@/utils/formatters";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportType, setReportType] = useState("daily");
  const [outputFormat, setOutputFormat] = useState<"print" | "pdf">("print");
  const { getDailySummary, getTotalBalance, getCategorySummary } = useFinance();

  const dailySummary = getDailySummary(selectedDate);
  const incomeCategories = getCategorySummary("income");
  const expenseCategories = getCategorySummary("expense");

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  const generateReport = () => {
    const reportDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const printDateTime = format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: es });
    
    let reportContent = `
      <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative;">
        <div style="position: absolute; top: 20px; right: 20px; font-size: 12px; color: #666;">
          Impreso: ${printDateTime}
        </div>
        <h1 style="text-align: center;">Reporte Financiero</h1>
        <h2 style="text-align: center;">${reportDate}</h2>
        
        <div style="margin-top: 20px;">
          <h3>Resumen del día</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Concepto</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Monto</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Ingresos en efectivo</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalIncomeCash)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Ingresos por transferencia</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalIncomeTransfer)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Total ingresos</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.totalIncome)}</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Egresos en efectivo</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalExpenseCash)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Egresos por transferencia</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalExpenseTransfer)}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Total egresos</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.totalExpense)}</strong></td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Balance del día</strong></td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.balance)}</strong></td>
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
              ${incomeCategories.map(cat => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${cat.category}</td>
                  <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(cat.total)}</td>
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
              ${expenseCategories.map(cat => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${cat.category}</td>
                  <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(cat.total)}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>Generado el ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm:ss", { locale: es })}</p>
        </div>
      </div>
    `;

    if (outputFormat === "print") {
      printDocument(reportContent);
    } else {
      generatePDF(reportContent, `reporte-financiero-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Generar Informes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Configuración del Informe</CardTitle>
              <CardDescription>
                Selecciona el tipo de informe y la fecha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" onValueChange={(value) => setReportType(value)}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="daily" className="w-1/2">Informe Diario</TabsTrigger>
                  <TabsTrigger value="range" className="w-1/2">Rango de Fechas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha del informe</label>
                    <input
                      type="date"
                      value={format(selectedDate, 'yyyy-MM-dd')}
                      onChange={handleDateChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="range" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha inicial</label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha final</label>
                      <input
                        type="date"
                        defaultValue={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Formato de salida:</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant={outputFormat === "print" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setOutputFormat("print")}
                    >
                      <Printer className="mr-1 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button
                      variant={outputFormat === "pdf" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setOutputFormat("pdf")}
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      Guardar PDF
                    </Button>
                  </div>
                </div>
                
                <Button onClick={generateReport} className="w-full mt-4">
                  Generar Informe
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Informes Rápidos</CardTitle>
              <CardDescription>
                Generar informes predefinidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Informe del día actual
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Informe de la semana
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Informe del mes
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Cierre de caja diario
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cierre de Caja Diario</DialogTitle>
                    <DialogDescription>
                      Este proceso generará un informe completo de todas las transacciones del día y preparará el sistema para el siguiente día.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total ingresos:</span>
                        <span className="font-medium">{formatCurrency(dailySummary.totalIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total egresos:</span>
                        <span className="font-medium">{formatCurrency(dailySummary.totalExpense)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <span className="font-medium">Balance del día:</span>
                        <span className="font-bold">{formatCurrency(dailySummary.balance)}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOutputFormat("print")}>
                      <Printer className="mr-1 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button variant="outline" onClick={() => setOutputFormat("pdf")}>
                      <FileText className="mr-1 h-4 w-4" />
                      Guardar PDF
                    </Button>
                    <Button>Confirmar Cierre</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
