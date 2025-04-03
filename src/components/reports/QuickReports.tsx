
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, FileText, Printer } from "lucide-react";
import { DailySummary } from "@/types/finance";
import { formatCurrency } from "@/utils/formatters";

interface QuickReportsProps {
  dailySummary: DailySummary;
  setOutputFormat: (format: "print" | "pdf") => void;
}

const QuickReports: React.FC<QuickReportsProps> = ({ dailySummary, setOutputFormat }) => {
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
    </div>
  );
};

export default QuickReports;
