
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/categories";
import CategoryList from "./categories/CategoryList";
import CategoryDialogs from "./categories/CategoryDialogs";
import { useCategories } from "@/hooks/useCategories";

const CategoryManagement = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  const {
    incomeCategories,
    expenseCategories,
    categoryType,
    setCategoryType,
    addCategory,
    editCategory,
    deleteCategory
  } = useCategories();

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
        onAddCategory={(data) => {
          if (addCategory(data)) {
            setOpenAddDialog(false);
          }
        }}
        onEditCategory={(data) => {
          if (currentCategory && editCategory(currentCategory, data)) {
            setOpenEditDialog(false);
          }
        }}
      />
    </div>
  );
};

export default CategoryManagement;
