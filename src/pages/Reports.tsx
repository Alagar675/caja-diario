import React, { useState } from "react";
import { Banknote, Calendar, CreditCard, FileText, Printer, Save, ArrowDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, printDocument, generatePDF } from "@/utils/formatters";
import { TransactionType } from "@/types/finance";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportType, setReportType] = useState("daily");
  const [outputFormat, setOutputFormat] = useState<"print" | "pdf">("print");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | "all">("all");
  const [selectedBalanceType, setSelectedBalanceType] = useState<string | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const {
    getDailySummary,
    getTotalBalance,
    getCategorySummary,
    getBalanceSummary
  } = useFinance();
  const dailySummary = getDailySummary(selectedDate);
  const incomeCategories = getCategorySummary("income");
  const expenseCategories = getCategorySummary("expense");
  const balanceSummary = getBalanceSummary();
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };
  const incomeCategoryOptions = ["Ventas en efectivo", "Ventas a crédito", "Recaudo Créditos", "Recaudos recurrentes", "Otros"];
  const expenseCategoryOptions = ["Pago de Facturas", "Pagos recurrentes", "Servicios públicos", "Pago salarios", "Otros"];
  const allCategories = [...incomeCategoryOptions, ...expenseCategoryOptions];
  const getFilteredCategories = () => {
    if (selectedTransactionType === "all") {
      return allCategories;
    }
    return selectedTransactionType === "income" ? incomeCategoryOptions : expenseCategoryOptions;
  };
  const generateReport = () => {
    const reportDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
      locale: es
    });
    const printDateTime = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
      locale: es
    });
    const categoryFilter = selectedCategory !== "all" ? `<h3 class="text-center">Filtrado por categoría: ${selectedCategory}</h3>` : '';
    const typeFilter = selectedTransactionType !== "all" ? `<h3 class="text-center">Tipo: ${selectedTransactionType === "income" ? "Ingresos" : "Egresos"}</h3>` : '';
    let reportContent = `
      <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative;">
        <div style="position: absolute; top: 20px; right: 20px; font-size: 12px; color: #666;">
          Impreso: ${printDateTime}
        </div>
        <h1 style="text-align: center;">Reporte Financiero</h1>
        <h2 style="text-align: center;">${reportDate}</h2>
        ${categoryFilter}
        ${typeFilter}
        
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
          <p>Generado el ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm:ss", {
      locale: es
    })}</p>
        </div>
      </div>
    `;
    if (outputFormat === "print") {
      printDocument(reportContent);
    } else {
      generatePDF(reportContent, `reporte-financiero-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
    }
  };
  const withdrawalForm = useForm({
    defaultValues: {
      amount: "",
      concept: "",
      authorizedBy: ""
    }
  });
  const handleWithdrawalRequest = () => {
    if (!selectedBalanceType) {
      toast.error("Debe seleccionar un tipo de saldo");
      return;
    }
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error("Debe ingresar un monto válido");
      return;
    }
    const amount = parseFloat(withdrawalAmount);
    let currentBalance = 0;
    switch (selectedBalanceType) {
      case "cash":
        currentBalance = balanceSummary.cashBalance;
        break;
      case "transfer":
        currentBalance = balanceSummary.transferBalance;
        break;
      case "credit":
        currentBalance = balanceSummary.creditBalance;
        break;
    }
    if (amount > currentBalance) {
      toast.error(`Saldo insuficiente. Saldo actual: ${formatCurrency(currentBalance)}`);
      return;
    }
    withdrawalForm.setValue("amount", withdrawalAmount);
    setWithdrawalDialogOpen(true);
  };
  const handleWithdrawalSubmit = withdrawalForm.handleSubmit(data => {
    toast.success(`Retiro de ${formatCurrency(parseFloat(data.amount))} procesado correctamente`);
    setSelectedBalanceType(null);
    setWithdrawalAmount("");
    setWithdrawalDialogOpen(false);
    withdrawalForm.reset();
  });
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Generar Informes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Configuración del Informe</CardTitle>
              <CardDescription>
                Selecciona el tipo de informe, la fecha y la categoría
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily" onValueChange={value => setReportType(value)}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="daily" className="w-1/2">Informe Diario</TabsTrigger>
                  <TabsTrigger value="range" className="w-1/2">Rango de Fechas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="daily" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha del informe</label>
                    <input type="date" value={format(selectedDate, 'yyyy-MM-dd')} onChange={handleDateChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
                  </div>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de transacción</label>
                      <Select value={selectedTransactionType} onValueChange={(value: any) => {
                      setSelectedTransactionType(value);
                      setSelectedCategory("all");
                    }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="income">Ingresos</SelectItem>
                          <SelectItem value="expense">Egresos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Categoría</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {getFilteredCategories().map(category => <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="range" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha inicial</label>
                      <input type="date" value={startDate} onChange={handleStartDateChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha final</label>
                      <input type="date" value={endDate} onChange={handleEndDateChange} className="w-full rounded-md border border-input bg-background px-3 py-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de transacción</label>
                      <Select value={selectedTransactionType} onValueChange={(value: any) => {
                      setSelectedTransactionType(value);
                      setSelectedCategory("all");
                    }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="income">Ingresos</SelectItem>
                          <SelectItem value="expense">Egresos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Categoría</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las categorías</SelectItem>
                          {getFilteredCategories().map(category => <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
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
                    <Button variant={outputFormat === "print" ? "default" : "outline"} size="sm" onClick={() => setOutputFormat("print")}>
                      <Printer className="mr-1 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button variant={outputFormat === "pdf" ? "default" : "outline"} size="sm" onClick={() => setOutputFormat("pdf")}>
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
              
              <div className="mt-6">
                <h3 className="font-medium mb-3 text-xl text-center text-green-900">Saldos Actuales</h3>
                <div className="space-y-3">
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Banknote className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">Efectivo</span>
                        </div>
                        <span className="font-bold">{formatCurrency(balanceSummary.cashBalance)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">Transferencias</span>
                        </div>
                        <span className="font-bold">{formatCurrency(balanceSummary.transferBalance)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm font-medium">Créditos</span>
                        </div>
                        <span className="font-bold">{formatCurrency(balanceSummary.creditBalance)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-3 text-lg text-center text-red-900">Retiro de Saldos Actuales</h3>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="cashBalance" checked={selectedBalanceType === "cash"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "cash" ? null : "cash")} />
                      <label htmlFor="cashBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Efectivo
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="transferBalance" checked={selectedBalanceType === "transfer"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "transfer" ? null : "transfer")} />
                      <label htmlFor="transferBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Transferencias
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="creditBalance" checked={selectedBalanceType === "credit"} onCheckedChange={() => setSelectedBalanceType(selectedBalanceType === "credit" ? null : "credit")} />
                      <label htmlFor="creditBalance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Créditos
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Monto a retirar</label>
                    <div className="flex space-x-2">
                      <Input type="number" placeholder="0.00" value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} className="flex-1" />
                      <Button onClick={handleWithdrawalRequest} className="flex items-center" disabled={!selectedBalanceType || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}>
                        <ArrowDown className="mr-1 h-4 w-4" />
                        Retirar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
        <DialogContent>
          <form onSubmit={handleWithdrawalSubmit}>
            <DialogHeader>
              <DialogTitle>Confirmar retiro de saldo</DialogTitle>
              <DialogDescription>
                Complete los siguientes datos para procesar el retiro.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Tipo:</label>
                <div className="col-span-3">
                  {selectedBalanceType === "cash" && "Efectivo"}
                  {selectedBalanceType === "transfer" && "Transferencias"}
                  {selectedBalanceType === "credit" && "Créditos"}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Monto:</label>
                <div className="col-span-3 font-medium">
                  {withdrawalAmount && formatCurrency(parseFloat(withdrawalAmount))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="concept" className="text-right text-sm font-medium">Concepto:</label>
                <div className="col-span-3">
                  <Input id="concept" {...withdrawalForm.register("concept", {
                  required: "El concepto es requerido"
                })} placeholder="Ingrese el concepto del retiro" className="w-full" />
                  {withdrawalForm.formState.errors.concept && <p className="text-sm text-red-500 mt-1">{withdrawalForm.formState.errors.concept.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="authorizedBy" className="text-right text-sm font-medium">Autorizado por:</label>
                <div className="col-span-3">
                  <Input id="authorizedBy" {...withdrawalForm.register("authorizedBy", {
                  required: "El nombre es requerido"
                })} placeholder="Nombre de quien autoriza" className="w-full" />
                  {withdrawalForm.formState.errors.authorizedBy && <p className="text-sm text-red-500 mt-1">{withdrawalForm.formState.errors.authorizedBy.message}</p>}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setWithdrawalDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar retiro</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Reports;