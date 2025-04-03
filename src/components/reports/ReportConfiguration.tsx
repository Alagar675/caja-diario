
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Printer } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types/finance";

interface ReportConfigurationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  reportType: string;
  setReportType: (type: string) => void;
  outputFormat: "print" | "pdf";
  setOutputFormat: (format: "print" | "pdf") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTransactionType: TransactionType | "all";
  setSelectedTransactionType: (type: TransactionType | "all") => void;
  generateReport: () => void;
  getFilteredCategories: () => string[];
}

const ReportConfiguration: React.FC<ReportConfigurationProps> = ({
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
  setSelectedTransactionType,
  generateReport,
  getFilteredCategories,
}) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };
  
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };
  
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Configuración del Informe</CardTitle>
        <CardDescription>
          Selecciona el tipo de informe, la fecha y la categoría
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" onValueChange={value => setReportType(value)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="daily" className="w-1/2">Informe Diario</TabsTrigger>
            <TabsTrigger value="range" className="w-1/2">Rango de Fechas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha del informe</label>
              <input 
                type="date" 
                value={format(selectedDate, 'yyyy-MM-dd')} 
                onChange={handleDateChange} 
                className="w-full rounded-md border border-input bg-background px-3 py-2" 
              />
            </div>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de transacción</label>
                <Select 
                  value={selectedTransactionType} 
                  onValueChange={(value: any) => {
                    setSelectedTransactionType(value);
                    setSelectedCategory("all");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Ingresos</SelectItem>
                    <SelectItem value="expense">Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {getFilteredCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="range" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha inicial</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={handleStartDateChange} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha final</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={handleEndDateChange} 
                  className="w-full rounded-md border border-input bg-background px-3 py-2" 
                />
              </div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo de transacción</label>
                <Select 
                  value={selectedTransactionType} 
                  onValueChange={(value: any) => {
                    setSelectedTransactionType(value);
                    setSelectedCategory("all");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Ingresos</SelectItem>
                    <SelectItem value="expense">Egresos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {getFilteredCategories().map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col space-y-4 w-full">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Formato de salida:</span>
            <div className="flex space-x-2">
              <Button 
                variant={outputFormat === "print" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setOutputFormat("print")}
              >
                <Printer className="mr-1 h-4 w-4" />
                Imprimir
              </Button>
              <Button 
                variant={outputFormat === "pdf" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setOutputFormat("pdf")}
              >
                <FileText className="mr-1 h-4 w-4" />
                Guardar PDF
              </Button>
            </div>
          </div>
          
          <Button onClick={generateReport} className="w-full mt-4">
            Generar Informe
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ReportConfiguration;
