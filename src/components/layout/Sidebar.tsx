
import React, { useEffect } from "react";
import { ArrowRight, DollarSign, BarChart, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onSidebarStateChange?: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, toggleSidebar, onSidebarStateChange }: SidebarProps) => {
  const { getDailySummary, getTotalBalance } = useFinance();
  const dailySummary = getDailySummary();
  const totalBalance = getTotalBalance();

  // Call the callback when sidebar state changes
  useEffect(() => {
    if (onSidebarStateChange) {
      onSidebarStateChange(isOpen);
    }
  }, [isOpen, onSidebarStateChange]);

  return (
    <div
      className={`fixed top-16 right-0 z-30 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="relative h-full">
        <Button
          variant="outline"
          size="sm"
          className="absolute -left-10 top-4 p-2 rounded-full shadow-md bg-primary text-white border-none"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Button>
        
        <Card className="h-full w-80 overflow-y-auto py-6 px-4 border-l shadow-lg">
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Resumen del día</h3>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <h4 className="text-sm font-medium mb-1">Balance Total</h4>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <DollarSign size={14} className="text-green-500" />
                  Ingresos
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Efectivo</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalIncomeCash)}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Transferencia</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalIncomeTransfer)}</p>
                  </div>
                  <div className="col-span-2 bg-green-100 dark:bg-green-900/40 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalIncome)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <DollarSign size={14} className="text-red-500" />
                  Egresos
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Efectivo</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalExpenseCash)}</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Transferencia</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalExpenseTransfer)}</p>
                  </div>
                  <div className="col-span-2 bg-red-100 dark:bg-red-900/40 p-2 rounded">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-medium">{formatCurrency(dailySummary.totalExpense)}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                  <BarChart size={14} className="text-blue-500" />
                  Balance del día
                </h4>
                <p className={`text-xl font-bold ${dailySummary.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(dailySummary.balance)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
