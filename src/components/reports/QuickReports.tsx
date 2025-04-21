
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Printer, ArrowDownCircle, ArrowUpCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinance, Transaction } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";
import { DailySummary } from "@/types/finance";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuickReportsProps {
  dailySummary: DailySummary;
  setOutputFormat: (format: "print" | "pdf") => void;
  onConfirmClose?: () => void;
}

const QuickReports: React.FC<QuickReportsProps> = ({
  dailySummary,
  setOutputFormat,
  onConfirmClose
}) => {
  const {
    transactions,
    archivedTransactions
  } = useFinance();
  const [highlightConfirmButton, setHighlightConfirmButton] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [selectedType, setSelectedType] = useState<"income" | "expense" | null>(null);

  // Function to handle print action
  const handlePrint = () => {
    setOutputFormat("print");
    highlightConfirmButtonEffect();
    setReportGenerated(true);
  };

  // Function to handle PDF action
  const handleSavePDF = () => {
    setOutputFormat("pdf");
    highlightConfirmButtonEffect();
    setReportGenerated(true);
  };

  // Function to highlight the confirm button to remind user to click it
  const highlightConfirmButtonEffect = () => {
    setHighlightConfirmButton(true);
    setTimeout(() => {
      setHighlightConfirmButton(false);
    }, 3000);
  };
  
  const handleConfirmClose = () => {
    if (onConfirmClose) {
      onConfirmClose();
    }
  };

  const getFilteredTransactions = (type: "income" | "expense") => {
    return transactions.filter(t => t.type === type).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);
  };
  
  // Get the timestamp of last cash close
  const getLastCashCloseTime = () => {
    const lastCloseTime = localStorage.getItem("lastCashCloseTime");
    return lastCloseTime ? new Date(lastCloseTime) : null;
  };
  
  const lastCloseTime = getLastCashCloseTime();
  const today = new Date();
  const isNewDay = lastCloseTime ? 
    lastCloseTime.getDate() !== today.getDate() || 
    lastCloseTime.getMonth() !== today.getMonth() || 
    lastCloseTime.getFullYear() !== today.getFullYear() : true;

  return (
    <div className="space-y-4">
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
          <Button 
            className={`w-full justify-start ${isNewDay ? "animate-pulse bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300" : ""}`} 
            variant="outline"
          >
            <Clock className={`mr-2 h-4 w-4 ${isNewDay ? "text-yellow-800" : ""}`} />
            Cierre de caja diario
            {isNewDay && <span className="ml-auto text-xs font-medium bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">Pendiente</span>}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cierre de Caja Diario</DialogTitle>
            <DialogDescription>
              Este proceso generará un informe completo de todas las transacciones del día y preparará el sistema para el siguiente día.
              {reportGenerated && <p className="mt-2 text-sm font-medium text-green-600">
                  Informe generado correctamente. Por favor confirme el cierre.
                </p>}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isNewDay && (
              <Alert className="mb-4 border-yellow-500 bg-yellow-50">
                <Clock className="h-4 w-4" />
                <AlertTitle>Cierre pendiente</AlertTitle>
                <AlertDescription>
                  Es necesario realizar el cierre de caja diario para reiniciar los saldos del día.
                </AlertDescription>
              </Alert>
            )}
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
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleSavePDF}>
              <FileText className="mr-1 h-4 w-4" />
              Guardar PDF
            </Button>
            <Button 
              className={`${highlightConfirmButton || isNewDay ? "animate-pulse ring-2 ring-primary ring-offset-2" : ""}`} 
              onClick={handleConfirmClose}
            >
              Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">Informes por tipo de transacción</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant={selectedType === "income" ? "default" : "outline"} className="flex-1" onClick={() => setSelectedType(selectedType === "income" ? null : "income")}>
              <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
              Ingresos
            </Button>
            <Button variant={selectedType === "expense" ? "default" : "outline"} className="flex-1" onClick={() => setSelectedType(selectedType === "expense" ? null : "expense")}>
              <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
              Egresos
            </Button>
          </div>

          {selectedType && <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {getFilteredTransactions(selectedType).map(transaction => <div key={transaction.id} className="flex justify-between items-start p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${selectedType === "income" ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.paymentMethod === "cash" ? "Efectivo" : "Transferencia"}
                      </p>
                    </div>
                  </div>)}
                {getFilteredTransactions(selectedType).length === 0 && <p className="text-center text-muted-foreground py-8">
                    No hay transacciones de este tipo registradas
                  </p>}
              </div>
            </ScrollArea>}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickReports;
