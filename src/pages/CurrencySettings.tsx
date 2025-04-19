import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, RefreshCcw, AlertTriangle, Settings2 } from "lucide-react";
import { currencyMap } from "@/utils/currency/currencyHelpers";
import { updateLocaleSettings } from "@/utils/currency/currencyFormatter";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { CurrencyDisplay } from "@/components/ui/currency-display";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const CurrencySettings = () => {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { rates, loading: ratesLoading, error: ratesError } = useCurrencyConversion();
  const [showFirstTimeAlert, setShowFirstTimeAlert] = useState(false);
  
  useEffect(() => {
    const hasSelectedCurrency = localStorage.getItem('userSelectedCurrency');
    if (!hasSelectedCurrency) {
      setShowFirstTimeAlert(true);
    } else {
      setSelectedCurrency(hasSelectedCurrency);
    }
  }, []);
  
  const handleSaveCurrency = () => {
    if (!selectedCurrency) {
      toast({
        title: "Error",
        description: "Debe seleccionar una moneda",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('userSelectedCurrency', selectedCurrency);
      
      updateLocaleSettings('es-CO', selectedCurrency);
      
      toast({
        title: "Configuración guardada",
        description: `La moneda principal se ha actualizado a ${selectedCurrency}`,
        variant: "default",
      });
      
      setLastUpdate(new Date());
      setIsSaving(false);
      setShowFirstTimeAlert(false);
    }, 800);
  };
  
  // Ordenar monedas por código
  const sortedCurrencies = Object.keys(currencyMap).sort();
  
  // Get currency name from code
  const getCurrencyName = (code: string) => {
    return currencyMap[code]?.name || "Moneda desconocida";
  };

  // Prepare exchange rate data for table display
  const getCurrencyRatesForDisplay = () => {
    if (!rates || Object.keys(rates).length === 0) return [];
    
    return Object.entries(rates)
      .filter(([code]) => code !== selectedCurrency) // Remove selected currency
      .sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          {showFirstTimeAlert && (
            <Alert variant="destructive" className="mb-6 animate-bounce">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                ¡Importante! Debe seleccionar una moneda principal para la aplicación
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Settings2 className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Configuración de Moneda</h1>
            </div>
            
            {lastUpdate && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs">
                  Última actualización: {lastUpdate.toLocaleTimeString()}
                </span>
              </Badge>
            )}
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Moneda Principal</CardTitle>
                <CardDescription>
                  Seleccione la moneda que desea utilizar como predeterminada en toda la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seleccionar moneda</label>
                  <Select 
                    value={selectedCurrency} 
                    onValueChange={setSelectedCurrency}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {sortedCurrencies.map(code => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{code}</span> - 
                            <span>{currencyMap[code].name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCurrency && (
                    <p className="text-sm text-gray-500 mt-1">
                      Símbolo: {currencyMap[selectedCurrency]?.symbol || selectedCurrency}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveCurrency} 
                  disabled={!selectedCurrency || isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="mr-2">Guardando...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Tasas de cambio</CardTitle>
                <CardDescription>
                  Tasas de cambio entre diferentes monedas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ratesLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <RefreshCcw className="h-8 w-8 text-gray-400 animate-spin" />
                  </div>
                ) : ratesError ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertTriangle className="h-10 w-10 text-amber-500 mb-2" />
                    <p className="text-gray-500">{ratesError}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Moneda base:</span>
                      <Badge className="font-mono">
                        {selectedCurrency} - {getCurrencyName(selectedCurrency)}
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="max-h-[300px] overflow-y-auto pr-1">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Código</TableHead>
                            <TableHead>Moneda</TableHead>
                            <TableHead className="text-right">Tasa</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCurrencyRatesForDisplay().map(([code, rate]) => (
                            <TableRow key={code}>
                              <TableCell className="font-mono font-medium">{code}</TableCell>
                              <TableCell>{getCurrencyName(code)}</TableCell>
                              <TableCell className="text-right font-mono">
                                {parseFloat(rate.toString()).toFixed(4)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default CurrencySettings;
