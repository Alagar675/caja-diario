
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFinance, TransactionType, PaymentMethod } from "@/context/FinanceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentDateForInput, getCurrentTimeForInput } from "@/utils/formatters";

interface TransactionFormProps {
  type: TransactionType;
}

const TransactionForm = ({
  type
}: TransactionFormProps) => {
  const {
    addTransaction
  } = useFinance();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [bankName, setBankName] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [date, setDate] = useState(getCurrentDateForInput());
  const [time, setTime] = useState(getCurrentTimeForInput());

  const categoryOptions = type === "income" 
    ? ["Ventas", "Recaudo Créditos", "Recaudos recurrentes", "Otros"] 
    : ["Facturas", "Pagos recurrentes", "Servicios públicos", "Pago salarios", "Otros"];

  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDescription("");
    setPaymentMethod("cash");
    setBankName("");
    setTransferNumber("");
    setRecipientName("");
    setRecipientId("");
    setDate(getCurrentDateForInput());
    setTime(getCurrentTimeForInput());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${date}T${time}`);
    addTransaction({
      type,
      amount: Number(amount),
      category,
      description,
      paymentMethod,
      bankName: paymentMethod === "transfer" ? bankName : undefined,
      transferNumber: paymentMethod === "transfer" ? transferNumber : undefined,
      recipientName,
      recipientId,
      date: dateTime
    });
    resetForm();
  };

  return <Card className="w-full max-w-2xl mx-auto glass animate-fade-in">
      <CardHeader>
        <CardTitle className="text-green-900">
          {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
        </CardTitle>
        <CardDescription>
          Complete los detalles de la transacción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input id="amount" type="number" placeholder="0" required value={amount} onChange={e => setAmount(e.target.value)} className="transition-all duration-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select required value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Elegir categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" placeholder="Detalle de la transacción" value={description} onChange={e => setDescription(e.target.value)} className="min-h-[100px] transition-all duration-200" />
          </div>

          <div className="space-y-2">
            <Label>Método de pago</Label>
            <RadioGroup defaultValue="cash" value={paymentMethod} onValueChange={value => setPaymentMethod(value as PaymentMethod)} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash">Efectivo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer">Transferencia</Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "transfer" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Banco</Label>
                <Input id="bankName" type="text" placeholder="Nombre del banco" required value={bankName} onChange={e => setBankName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferNumber">Número de transferencia</Label>
                <Input id="transferNumber" type="text" placeholder="Número de transferencia" required value={transferNumber} onChange={e => setTransferNumber(e.target.value)} />
              </div>
            </div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Nombre</Label>
              <Input id="recipientName" type="text" placeholder="Nombre completo" required value={recipientName} onChange={e => setRecipientName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientId">Documento de identidad</Label>
              <Input id="recipientId" type="text" placeholder="Número de documento" required value={recipientId} onChange={e => setRecipientId(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" required value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input id="time" type="time" required value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          {type === "income" ? "Registrar Ingreso" : "Registrar Egreso"}
        </Button>
      </CardFooter>
    </Card>;
};

export default TransactionForm;
