
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
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
import { useToast } from "@/components/ui/use-toast";
import { Globe, CheckCircle, RefreshCcw, AlertTriangle } from "lucide-react";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { currencyMap } from "@/utils/currency/currencyHelpers";
import { updateLocaleSettings } from "@/utils/currency/currencyFormatter";
import { useCurrencyConversion } from "@/hooks/useCurrencyConversion";
import { CurrencyDisplay } from "@/components/ui/currency-display";

const CurrencySettings = () => {
  const { toast } = useToast();
  const localeInfo = useGeoLocaleDetection();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { rates, loading: ratesLoading, error: ratesError } = useCurrencyConversion();
  
  useEffect(() => {
    if (!localeInfo.loading && !selectedCurrency) {
      setSelectedCurrency(localeInfo.currencyCode);
    }
  }, [localeInfo.loading, localeInfo.currencyCode, selectedCurrency]);
  
  const handleSaveCurrency = () => {
    setIsSaving(true);
    
    // Simular un tiempo de guardado
    setTimeout(() => {
      // Guardar en localStorage para persistencia
      localStorage.setItem('userSelectedCurrency', selectedCurrency);
      
      // Actualizar la configuración global
      updateLocaleSettings(localeInfo.locale, selectedCurrency);
      
      toast({
        title: "Configuración guardada",
        description: `La moneda principal se ha actualizado a ${selectedCurrency}`,
        variant: "default",
      });
      
      setLastUpdate(new Date());
      setIsSaving(false);
    }, 800);
  };
  
  // Ordenar monedas por código
  const sortedCurrencies = Object.keys(currencyMap).sort();
  
  // Get currency name from code
  const getCurrencyName = (code: string) => {
    return currencyMap[code]?.name || "Moneda desconocida";
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Configuración de Moneda</h1>
            
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
                <div className="space-y-1">
                  <label className="text-sm font-medium">Moneda actual</label>
                  <div className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded-md">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">
                      {localeInfo.loading 
                        ? "Detectando..." 
                        : `${localeInfo.currencyCode}`}
                    </span>
                    <span className="text-gray-500">
                      {localeInfo.loading 
                        ? "" 
                        : `- ${currencyMap[localeInfo.currencyCode]?.name || "Desconocida"}`}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Seleccionar moneda</label>
                  <Select 
                    value={selectedCurrency} 
                    onValueChange={setSelectedCurrency}
                    disabled={localeInfo.loading}
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
                
                <div className="pt-4 text-sm text-gray-500">
                  <p>Esta configuración afectará a todas las partes de la aplicación que muestren valores monetarios.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedCurrency(localeInfo.currencyCode)}
                  disabled={selectedCurrency === localeInfo.currencyCode || localeInfo.loading}
                >
                  Restablecer
                </Button>
                <Button 
                  onClick={handleSaveCurrency} 
                  disabled={!selectedCurrency || selectedCurrency === localStorage.getItem('userSelectedCurrency') || isSaving}
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
              <CardContent className="space-y-4">
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
                      <Badge>{localeInfo.currencyCode}</Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {Object.entries(rates).slice(0, 12).map(([currency, rate]) => (
                        <div key={currency} className="flex justify-between items-center py-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{currency}</span>
                            <span className="text-xs text-gray-500 ml-1">- {getCurrencyName(currency)}</span>
                          </div>
                          <div className="text-sm">
                            <CurrencyDisplay 
                              value={1} 
                              currencyCode={localeInfo.currencyCode} 
                              showSymbol={true}
                              size="sm"
                            /> = <CurrencyDisplay 
                              value={rate} 
                              currencyCode={currency} 
                              showSymbol={true}
                              size="sm"
                            />
                          </div>
                        </div>
                      ))}
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
