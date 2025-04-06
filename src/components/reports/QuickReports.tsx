
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Printer } from "lucide-react";
import { DailySummary } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";

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
  const [highlightConfirmButton, setHighlightConfirmButton] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
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
    // Remove the highlight effect after 3 seconds
    setTimeout(() => {
      setHighlightConfirmButton(false);
    }, 3000);
  };
  
  // Function to handle close confirmation
  const handleConfirmClose = () => {
    if (onConfirmClose) {
      onConfirmClose();
    }
  };

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
              {reportGenerated && (
                <p className="mt-2 text-sm font-medium text-green-600">
                  Informe generado correctamente. Por favor confirme el cierre.
                </p>
              )}
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
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" onClick={handleSavePDF}>
              <FileText className="mr-1 h-4 w-4" />
              Guardar PDF
            </Button>
            <Button 
              className={`${highlightConfirmButton ? "animate-pulse ring-2 ring-primary ring-offset-2" : ""}`}
              onClick={handleConfirmClose}
            >
              Confirmar Cierre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuickReports;
