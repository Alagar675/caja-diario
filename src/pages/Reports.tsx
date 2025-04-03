import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, printDocument, generatePDF } from "@/utils/formatters";
import { TransactionType } from "@/types/finance";

// Import refactored components
import ReportConfiguration from "@/components/reports/ReportConfiguration";
import QuickReports from "@/components/reports/QuickReports";
import BalanceSummary from "@/components/reports/BalanceSummary";
import WithdrawalSection from "@/components/reports/WithdrawalSection";
import WithdrawalDialog from "@/components/reports/WithdrawalDialog";
import WithdrawalHistoryDialog from "@/components/reports/WithdrawalHistoryDialog";
const Reports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportType, setReportType] = useState("daily");
  const [outputFormat, setOutputFormat] = useState<"print" | "pdf">("print");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | "all">("all");
  const [selectedBalanceType, setSelectedBalanceType] = useState<"cash" | "transfer" | "credit" | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalHistoryDialog, setWithdrawalHistoryDialog] = useState(false);
  const {
    getDailySummary,
    getCategorySummary,
    getBalanceSummary,
    addWithdrawal,
    withdrawals,
    getTotalWithdrawals
  } = useFinance();
  const dailySummary = getDailySummary(selectedDate);
  const incomeCategories = getCategorySummary("income");
  const expenseCategories = getCategorySummary("expense");
  const balanceSummary = getBalanceSummary();
  const withdrawalSummary = getTotalWithdrawals();
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
    const withdrawal = {
      amount: parseFloat(data.amount),
      source: selectedBalanceType as "cash" | "transfer" | "credit",
      concept: data.concept,
      authorizedBy: data.authorizedBy
    };
    addWithdrawal(withdrawal);
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
          <ReportConfiguration selectedDate={selectedDate} setSelectedDate={setSelectedDate} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} reportType={reportType} setReportType={setReportType} outputFormat={outputFormat} setOutputFormat={setOutputFormat} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedTransactionType={selectedTransactionType} setSelectedTransactionType={setSelectedTransactionType} generateReport={generateReport} getFilteredCategories={getFilteredCategories} />
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-center">Informes Rápidos</CardTitle>
              <CardDescription>
                Generar informes predefinidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickReports dailySummary={dailySummary} setOutputFormat={setOutputFormat} />
              
              <BalanceSummary cashBalance={balanceSummary.cashBalance} transferBalance={balanceSummary.transferBalance} creditBalance={balanceSummary.creditBalance} />
              
              <WithdrawalSection selectedBalanceType={selectedBalanceType} setSelectedBalanceType={setSelectedBalanceType} withdrawalAmount={withdrawalAmount} setWithdrawalAmount={setWithdrawalAmount} handleWithdrawalRequest={handleWithdrawalRequest} withdrawalSummary={withdrawalSummary} setWithdrawalHistoryDialog={setWithdrawalHistoryDialog} />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <WithdrawalDialog open={withdrawalDialogOpen} setOpen={setWithdrawalDialogOpen} selectedBalanceType={selectedBalanceType} withdrawalAmount={withdrawalAmount} form={withdrawalForm} onSubmit={handleWithdrawalSubmit} />
      
      <WithdrawalHistoryDialog open={withdrawalHistoryDialog} setOpen={setWithdrawalHistoryDialog} withdrawals={withdrawals} />
    </div>;
};
export default Reports;