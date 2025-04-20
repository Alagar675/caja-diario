
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import { z } from "zod";
import { categoryFormSchema } from "./CategoryForm";
import { Category } from "../../../types/categories";

interface CategoryDialogsProps {
  openAddDialog: boolean;
  setOpenAddDialog: (open: boolean) => void;
  openEditDialog: boolean;
  setOpenEditDialog: (open: boolean) => void;
  currentCategory: Category | null;
  categoryType: "income" | "expense";
  onAddCategory: (data: z.infer<typeof categoryFormSchema>) => void;
  onEditCategory: (data: z.infer<typeof categoryFormSchema>) => void;
}

const CategoryDialogs = ({
  openAddDialog,
  setOpenAddDialog,
  openEditDialog,
  setOpenEditDialog,
  currentCategory,
  categoryType,
  onAddCategory,
  onEditCategory,
}: CategoryDialogsProps) => {
  return (
    <>
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
          <CategoryForm onSubmit={onAddCategory} />
        </DialogContent>
      </Dialog>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>
              Actualice la información de la categoría.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={onEditCategory}
            defaultValues={
              currentCategory
                ? {
                    name: currentCategory.name,
                    description: currentCategory.description || "",
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryDialogs;
