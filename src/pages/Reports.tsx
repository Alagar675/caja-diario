import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { useFinance } from "@/context/FinanceContext";
import { generateFinancialReport } from "@/utils/reportGenerator";
import { TransactionType } from "@/types/finance";

// Import custom hooks for report management
import useReportManagement from "@/hooks/useReportManagement";
import useWithdrawalManagement from "@/hooks/useWithdrawalManagement";
import useDailyCashClose from "@/hooks/useDailyCashClose";

// Import refactored components
import ReportConfiguration from "@/components/reports/ReportConfiguration";
import QuickReports from "@/components/reports/QuickReports";
import BalanceSummary from "@/components/reports/BalanceSummary";
import WithdrawalSection from "@/components/reports/WithdrawalSection";
import WithdrawalDialog from "@/components/reports/WithdrawalDialog";
import WithdrawalHistoryDialog from "@/components/reports/WithdrawalHistoryDialog";
import CloseSuccessDialog from "@/components/reports/CloseSuccessDialog";

const Reports = () => {
  // Report management hook
  const {
    selectedDate,
    setSelectedDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportType,
    setReportType,
    outputFormat,
    setOutputFormat,
    selectedCategory,
    setSelectedCategory,
    selectedTransactionType,
    setSelectedTransactionType
  } = useReportManagement();
  
  // Withdrawal management hook
  const {
    selectedBalanceType,
    setSelectedBalanceType,
    withdrawalAmount,
    setWithdrawalAmount,
    withdrawalDialogOpen,
    setWithdrawalDialogOpen,
    withdrawalHistoryDialog,
    setWithdrawalHistoryDialog,
    withdrawalForm,
    handleWithdrawalRequest,
    handleWithdrawalSubmit,
    balanceSummary,
    withdrawalSummary
  } = useWithdrawalManagement();
  
  // Daily cash close hook
  const {
    closeSuccessDialogOpen,
    setCloseSuccessDialogOpen,
    handleDailyCashClose,
    handleExitApplication
  } = useDailyCashClose();
  
  // Get finance data
  const {
    getDailySummary,
    getCategorySummary,
    withdrawals
  } = useFinance();
  
  const dailySummary = getDailySummary(selectedDate);
  const incomeCategories = getCategorySummary("income");
  const expenseCategories = getCategorySummary("expense");
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
    generateFinancialReport(
      dailySummary,
      incomeCategories,
      expenseCategories,
      selectedDate,
      selectedCategory,
      selectedTransactionType,
      outputFormat
    );
  };
  
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      
      <main className="w-full container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Generar Informes</h1>
        
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          <ReportConfiguration 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            startDate={startDate} 
            setStartDate={setStartDate} 
            endDate={endDate} 
            setEndDate={setEndDate} 
            reportType={reportType} 
            setReportType={setReportType} 
            outputFormat={outputFormat} 
            setOutputFormat={setOutputFormat} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            selectedTransactionType={selectedTransactionType} 
            setSelectedTransactionType={setSelectedTransactionType} 
            generateReport={generateReport} 
            getFilteredCategories={getFilteredCategories} 
          />
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-center">Informes Rápidos</CardTitle>
              <CardDescription>
                Generar informes predefinidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickReports 
                dailySummary={dailySummary} 
                setOutputFormat={setOutputFormat} 
                onConfirmClose={handleDailyCashClose}
              />
              
              <BalanceSummary />
              
              <WithdrawalSection 
                selectedBalanceType={selectedBalanceType} 
                setSelectedBalanceType={setSelectedBalanceType} 
                withdrawalAmount={withdrawalAmount} 
                setWithdrawalAmount={setWithdrawalAmount} 
                handleWithdrawalRequest={handleWithdrawalRequest} 
                withdrawalSummary={withdrawalSummary} 
                setWithdrawalHistoryDialog={setWithdrawalHistoryDialog} 
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <WithdrawalDialog 
        open={withdrawalDialogOpen} 
        setOpen={setWithdrawalDialogOpen} 
        selectedBalanceType={selectedBalanceType} 
        withdrawalAmount={withdrawalAmount} 
        form={withdrawalForm} 
        onSubmit={handleWithdrawalSubmit} 
      />
      
      <WithdrawalHistoryDialog 
        open={withdrawalHistoryDialog} 
        setOpen={setWithdrawalHistoryDialog} 
        withdrawals={withdrawals} 
      />
      
      <CloseSuccessDialog
        open={closeSuccessDialogOpen}
        onOpenChange={setCloseSuccessDialogOpen}
        onExit={handleExitApplication}
      />
    </div>
  );
};

export default Reports;
