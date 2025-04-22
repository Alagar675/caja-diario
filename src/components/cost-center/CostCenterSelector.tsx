
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CostCenterSelector = () => {
  const { costCenters, selectedCostCenter, selectCostCenter } = useFinance();

  const handleSelect = (value: string) => {
    if (value === "none") {
      selectCostCenter(null);
    } else {
      selectCostCenter(value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Elegir Centro de Costos</CardTitle>
          {selectedCostCenter && (
            <Badge variant="outline" className="ml-auto">
              Activo: {selectedCostCenter.name}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedCostCenter?.id || "none"}
            onValueChange={handleSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar centro de costos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin centro de costos</SelectItem>
              {costCenters.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>
                  {cc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedCostCenter && (
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Información del centro seleccionado</h4>
              <p><strong>Nombre:</strong> {selectedCostCenter.name}</p>
              {selectedCostCenter.description && (
                <p><strong>Descripción:</strong> {selectedCostCenter.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Creado el {format(selectedCostCenter.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => selectCostCenter(null)}
              >
                Desactivar Centro de Costos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CostCenterSelector;
