
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categoryFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

interface Category {
  id: string;
  name: string;
  description: string;
}

const CategoryManagement = () => {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryType, setCategoryType] = useState<"income" | "expense">("income");

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

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
      // Set default income categories if none exist
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
      // Set default expense categories if none exist
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
      reset();
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
      reset();
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

  const editCategory = (category: Category) => {
    setCurrentCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setOpenEditDialog(true);
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
                <Button onClick={() => {
                  reset();
                  setCategoryType("income");
                  setOpenAddDialog(true);
                }}>
                  Agregar Categoría de Ingreso
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incomeCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 italic text-muted-foreground">
                        No hay categorías de ingresos
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomeCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => editCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="expense">
              <div className="flex justify-end mb-4">
                <Button onClick={() => {
                  reset();
                  setCategoryType("expense");
                  setOpenAddDialog(true);
                }}>
                  Agregar Categoría de Egreso
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 italic text-muted-foreground">
                        No hay categorías de egresos
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenseCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => editCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteCategory(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Agregar Categoría de {categoryType === "income" ? "Ingreso" : "Egreso"}
            </DialogTitle>
            <DialogDescription>
              Complete el formulario para agregar una nueva categoría.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddCategory)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre de la categoría"
                {...registerForm("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Descripción breve"
                {...registerForm("description")}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Actualice la información de la categoría.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditCategory)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                placeholder="Nombre de la categoría"
                {...registerForm("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción (opcional)</Label>
              <Input
                id="edit-description"
                placeholder="Descripción breve"
                {...registerForm("description")}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Actualizar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManagement;
