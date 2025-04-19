
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateLocaleSettings } from "@/utils/currency/currencyFormatter";
import { Currency } from "lucide-react";

const CurrencySettings = () => {
  const [currencyConverterEnabled, setCurrencyConverterEnabled] = useState(false);
  
  useEffect(() => {
    // Load current settings
    const enabled = localStorage.getItem("currency_converter_enabled") === "true";
    setCurrencyConverterEnabled(enabled);
  }, []);
  
  const toggleCurrencyConverter = () => {
    const newValue = !currencyConverterEnabled;
    setCurrencyConverterEnabled(newValue);
    localStorage.setItem("currency_converter_enabled", newValue.toString());
    
    if (newValue) {
      toast.success("Conversor de divisas activado");
    } else {
      toast.info("Conversor de divisas desactivado");
    }
  };
  
  const resetCurrencySettings = () => {
    try {
      // Reset to default currency (Colombian Peso)
      localStorage.setItem("userSelectedCurrency", "COP");
      updateLocaleSettings('es-CO', 'COP');
      toast.success("Configuración de moneda restablecida a COP (Peso Colombiano)");
      
      // Force reload to apply changes
      window.location.reload();
    } catch (error) {
      toast.error("Error al restablecer la configuración de moneda");
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Divisas</CardTitle>
          <CardDescription>
            Administre la configuración del conversor de divisas y moneda predeterminada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <Currency className="h-6 w-6 text-primary" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Conversor de Divisas
              </p>
              <p className="text-sm text-muted-foreground">
                Activar el conversor de divisas en la aplicación
              </p>
            </div>
            <Switch 
              checked={currencyConverterEnabled}
              onCheckedChange={toggleCurrencyConverter}
            />
          </div>
          
          <div className="flex flex-col space-y-4">
            <Label>Moneda Predeterminada</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={resetCurrencySettings}>
                Restablecer a Peso Colombiano (COP)
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/settings/currency"}>
                Cambiar Moneda Predeterminada
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              La moneda predeterminada se utiliza para mostrar valores en toda la aplicación.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencySettings;
