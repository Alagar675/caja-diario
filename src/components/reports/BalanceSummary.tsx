
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, CreditCard, FileText } from "lucide-react";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { useCategories } from "@/hooks/useCategories";

const BalanceSummary: React.FC = () => {
  const { cashBalance, transferBalance, creditBalance } = useCategories();
  const totalBalance = cashBalance + transferBalance + creditBalance;
  
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
              <CurrencyDisplay value={cashBalance} align="right" />
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
              <CurrencyDisplay value={transferBalance} align="right" />
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
              <CurrencyDisplay value={creditBalance} align="right" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="text-sm font-medium mb-1">Balance Total</h4>
              <CurrencyDisplay value={totalBalance} size="xl" align="center" className="block" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BalanceSummary;
