
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CostCenter } from "@/types/finance";
import { useAuth } from "@/context/AuthContext";

export const useCostCenterManagement = () => {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const { user } = useAuth();

  // Cargar centros de costos del localStorage al iniciar
  useEffect(() => {
    if (user) {
      const storedCostCenters = localStorage.getItem(`costCenters-${user.id}`);
      if (storedCostCenters) {
        try {
          const parsedCostCenters = JSON.parse(storedCostCenters).map((cc: any) => ({
            ...cc,
            createdAt: new Date(cc.createdAt)
          }));
          setCostCenters(parsedCostCenters);
        } catch (error) {
          console.error("Error al cargar centros de costos:", error);
        }
      }

      const storedSelectedCostCenter = localStorage.getItem(`selectedCostCenter-${user.id}`);
      if (storedSelectedCostCenter) {
        try {
          const parsedSelectedCostCenter = JSON.parse(storedSelectedCostCenter);
          if (parsedSelectedCostCenter) {
            setSelectedCostCenter({
              ...parsedSelectedCostCenter,
              createdAt: new Date(parsedSelectedCostCenter.createdAt)
            });
          }
        } catch (error) {
          console.error("Error al cargar centro de costos seleccionado:", error);
        }
      }
    } else {
      setCostCenters([]);
      setSelectedCostCenter(null);
    }
  }, [user]);

  // Guardar centros de costos en localStorage cuando cambien
  useEffect(() => {
    if (user && costCenters.length > 0) {
      localStorage.setItem(`costCenters-${user.id}`, JSON.stringify(costCenters));
    }
  }, [costCenters, user]);

  // Guardar centro de costos seleccionado en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`selectedCostCenter-${user.id}`, JSON.stringify(selectedCostCenter));
    }
  }, [selectedCostCenter, user]);

  const addCostCenter = (newCostCenter: Omit<CostCenter, "id" | "userId" | "createdAt">) => {
    if (!user) {
      toast.error("Debe iniciar sesión para registrar un centro de costos");
      return;
    }

    const costCenter: CostCenter = {
      ...newCostCenter,
      id: `costCenter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      createdAt: new Date()
    };

    setCostCenters(prev => [...prev, costCenter]);
    toast.success(`Centro de costos "${costCenter.name}" registrado correctamente`);
  };

  const selectCostCenter = (costCenterId: string | null) => {
    if (!costCenterId) {
      setSelectedCostCenter(null);
      toast.info("Centro de costos desactivado");
      return;
    }

    const costCenter = costCenters.find(cc => cc.id === costCenterId);
    if (costCenter) {
      setSelectedCostCenter(costCenter);
      toast.success(`Centro de costos "${costCenter.name}" seleccionado`);
    } else {
      toast.error("Centro de costos no encontrado");
    }
  };

  return {
    costCenters,
    selectedCostCenter,
    addCostCenter,
    selectCostCenter
  };
};

export default useCostCenterManagement;
