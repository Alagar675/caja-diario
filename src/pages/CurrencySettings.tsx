
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Globe, CheckCircle } from "lucide-react";
import { useGeoLocaleDetection } from "@/hooks/useGeoLocaleDetection";
import { currencyMap } from "@/utils/currency/currencyHelpers";
import { updateLocaleSettings } from "@/utils/currency/currencyFormatter";

const CurrencySettings = () => {
  const { toast } = useToast();
  const localeInfo = useGeoLocaleDetection();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  
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
        variant: "default", // Changed from "success" to "default"
      });
      
      setIsSaving(false);
    }, 800);
  };
  
  // Ordenar monedas por código
  const sortedCurrencies = Object.keys(currencyMap).sort();

  return (
    <div className="min-h-screen w-full bg-background">
      <AppLayout initialSidebarOpen={true}>
        <div className="w-full container mx-auto py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Configuración de Moneda</h1>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Moneda Principal</CardTitle>
                <CardDescription>
                  Seleccione la moneda que desea utilizar como predeterminada en toda la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Moneda actual</label>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span>
                      {localeInfo.loading 
                        ? "Detectando..." 
                        : `${localeInfo.currencyCode} - ${currencyMap[localeInfo.currencyCode]?.name || "Desconocida"}`}
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
                    <SelectContent>
                      {sortedCurrencies.map(code => (
                        <SelectItem key={code} value={code}>
                          {code} - {currencyMap[code].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default CurrencySettings;
