
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinance, Transaction } from "@/context/FinanceContext";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const TransactionList = () => {
  const { transactions } = useFinance();

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="w-full glass animate-fade-in">
      <CardHeader>
        <CardTitle>Últimas Transacciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
            {sortedTransactions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay transacciones registradas
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  const isIncome = transaction.type === "income";

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isIncome ? (
            <ArrowUpCircle className="h-5 w-5" />
          ) : (
            <ArrowDownCircle className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-medium">{transaction.category}</p>
          <p className="text-sm text-muted-foreground">{transaction.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDateTime(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-sm text-muted-foreground">
          {transaction.paymentMethod === "cash" ? "Efectivo" : "Transferencia"}
        </p>
        {transaction.paymentMethod === "transfer" && (
          <p className="text-xs text-muted-foreground">{transaction.bankName}</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
