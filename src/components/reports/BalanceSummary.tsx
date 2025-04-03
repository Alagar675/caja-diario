
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, CreditCard, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface BalanceSummaryProps {
  cashBalance: number;
  transferBalance: number;
  creditBalance: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ 
  cashBalance, 
  transferBalance, 
  creditBalance 
}) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3 text-xl text-center text-green-900">Saldos Actuales</h3>
      <div className="space-y-3 max-w-xs mx-auto">
        <Card className="bg-muted">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Banknote className="h-5 w-5 mr-2 text-primary" />
                <span className="text-sm font-medium">Efectivo</span>
              </div>
              <span className="font-bold">{formatCurrency(cashBalance)}</span>
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
              <span className="font-bold">{formatCurrency(transferBalance)}</span>
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
              <span className="font-bold">{formatCurrency(creditBalance)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BalanceSummary;
