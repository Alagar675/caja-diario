import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Category } from "@/types/categories";
import { z } from "zod";
import { categoryFormSchema } from "@/components/settings/categories/CategoryForm";
import { useFinance } from "@/context/FinanceContext";

export const useCategories = () => {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [categoryType, setCategoryType] = useState<"income" | "expense">("income");
  const { getBalanceSummary } = useFinance();
  const { cashBalance, transferBalance, creditBalance } = getBalanceSummary();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    // Load income categories
    const incomeCategoriesStr = localStorage.getItem("income_categories");
    if (incomeCategoriesStr) {
      try {
        setIncomeCategories(JSON.parse(incomeCategoriesStr));
      } catch (error) {
        console.error("Error loading income categories:", error);
        setIncomeCategories([]);
      }
    } else {
      const defaultIncomeCategories = [
        { id: "inc-1", name: "Salario", description: "Ingresos por salario" },
        { id: "inc-2", name: "Ventas", description: "Ingresos por ventas" },
      ];
      localStorage.setItem("income_categories", JSON.stringify(defaultIncomeCategories));
      setIncomeCategories(defaultIncomeCategories);
    }
    
    // Load expense categories
    const expenseCategoriesStr = localStorage.getItem("expense_categories");
    if (expenseCategoriesStr) {
      try {
        setExpenseCategories(JSON.parse(expenseCategoriesStr));
      } catch (error) {
        console.error("Error loading expense categories:", error);
        setExpenseCategories([]);
      }
    } else {
      const defaultExpenseCategories = [
        { id: "exp-1", name: "Servicios", description: "Gastos de servicios públicos" },
        { id: "exp-2", name: "Alimentación", description: "Gastos en alimentos" },
      ];
      localStorage.setItem("expense_categories", JSON.stringify(defaultExpenseCategories));
      setExpenseCategories(defaultExpenseCategories);
    }
  };

  const addCategory = (data: z.infer<typeof categoryFormSchema>) => {
    try {
      const newCategory = {
        id: `${categoryType.substring(0, 3)}-${Date.now()}`,
        name: data.name,
        description: data.description || "",
      };
      
      const storageKey = categoryType === "income" ? "income_categories" : "expense_categories";
      const currentCategories = categoryType === "income" ? incomeCategories : expenseCategories;
      const updatedCategories = [...currentCategories, newCategory];
      
      localStorage.setItem(storageKey, JSON.stringify(updatedCategories));
      
      if (categoryType === "income") {
        setIncomeCategories(updatedCategories);
      } else {
        setExpenseCategories(updatedCategories);
      }
      
      toast.success(`Categoría de ${categoryType === "income" ? "ingreso" : "egreso"} agregada exitosamente`);
      return true;
    } catch (error: any) {
      toast.error("Error al agregar categoría: " + error.message);
      return false;
    }
  };

  const editCategory = (currentCategory: Category, data: z.infer<typeof categoryFormSchema>) => {
    try {
      const isIncome = currentCategory.id.startsWith("inc");
      const storageKey = isIncome ? "income_categories" : "expense_categories";
      const currentCategories = isIncome ? incomeCategories : expenseCategories;
      
      const updatedCategories = currentCategories.map(cat => 
        cat.id === currentCategory.id 
          ? { ...cat, name: data.name, description: data.description || "" } 
          : cat
      );
      
      localStorage.setItem(storageKey, JSON.stringify(updatedCategories));
      
      if (isIncome) {
        setIncomeCategories(updatedCategories);
      } else {
        setExpenseCategories(updatedCategories);
      }
      
      toast.success("Categoría actualizada exitosamente");
      return true;
    } catch (error: any) {
      toast.error("Error al actualizar categoría: " + error.message);
      return false;
    }
  };

  const deleteCategory = (category: Category) => {
    try {
      const isIncome = category.id.startsWith("inc");
      const storageKey = isIncome ? "income_categories" : "expense_categories";
      const currentCategories = isIncome ? incomeCategories : expenseCategories;
      
      const updatedCategories = currentCategories.filter(cat => cat.id !== category.id);
      
      localStorage.setItem(storageKey, JSON.stringify(updatedCategories));
      
      if (isIncome) {
        setIncomeCategories(updatedCategories);
      } else {
        setExpenseCategories(updatedCategories);
      }
      
      toast.success("Categoría eliminada exitosamente");
      return true;
    } catch (error: any) {
      toast.error("Error al eliminar categoría: " + error.message);
      return false;
    }
  };

  return {
    incomeCategories,
    expenseCategories,
    categoryType,
    setCategoryType,
    addCategory,
    editCategory,
    deleteCategory,
    cashBalance,
    transferBalance,
    creditBalance
  };
};
