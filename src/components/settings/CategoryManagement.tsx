
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Category } from "@/types/categories";
import { categoryFormSchema } from "./categories/CategoryForm";
import CategoryList from "./categories/CategoryList";
import CategoryDialogs from "./categories/CategoryDialogs";
import { z } from "zod";

const CategoryManagement = () => {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<"income" | "expense">("income");

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

  const onAddCategory = (data: z.infer<typeof categoryFormSchema>) => {
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
      setOpenAddDialog(false);
    } catch (error: any) {
      toast.error("Error al agregar categoría: " + error.message);
    }
  };

  const onEditCategory = (data: z.infer<typeof categoryFormSchema>) => {
    if (!currentCategory) return;
    
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
      setOpenEditDialog(false);
    } catch (error: any) {
      toast.error("Error al actualizar categoría: " + error.message);
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
    } catch (error: any) {
      toast.error("Error al eliminar categoría: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Categorías</CardTitle>
              <CardDescription>
                Administra las categorías para ingresos y egresos.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="income" onValueChange={(value) => setCategoryType(value as "income" | "expense")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="income">Ingresos</TabsTrigger>
              <TabsTrigger value="expense">Egresos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="income">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setOpenAddDialog(true)}>
                  Agregar Categoría de Ingreso
                </Button>
              </div>
              <CategoryList
                categories={incomeCategories}
                onEdit={(category) => {
                  setCurrentCategory(category);
                  setOpenEditDialog(true);
                }}
                onDelete={deleteCategory}
              />
            </TabsContent>
            
            <TabsContent value="expense">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setOpenAddDialog(true)}>
                  Agregar Categoría de Egreso
                </Button>
              </div>
              <CategoryList
                categories={expenseCategories}
                onEdit={(category) => {
                  setCurrentCategory(category);
                  setOpenEditDialog(true);
                }}
                onDelete={deleteCategory}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CategoryDialogs
        openAddDialog={openAddDialog}
        setOpenAddDialog={setOpenAddDialog}
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        currentCategory={currentCategory}
        categoryType={categoryType}
        onAddCategory={onAddCategory}
        onEditCategory={onEditCategory}
      />
    </div>
  );
};

export default CategoryManagement;
