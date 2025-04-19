
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagement } from "@/hooks/useUserManagement";
import UserTable from "./users/UserTable";
import UserFormDialog from "./users/UserFormDialog";
import { useAuth } from "@/context/AuthContext";

const UserManagement = () => {
  const {
    users,
    openAddDialog,
    setOpenAddDialog,
    openEditDialog,
    setOpenEditDialog,
    currentSelectedUser,
    setCurrentSelectedUser,
    onAddUser,
    onEditUser,
    deleteUser,
  } = useUserManagement();

  const { user: currentUser } = useAuth();

  const handleEditUser = (user: any) => {
    setCurrentSelectedUser(user);
    setOpenEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Administra los usuarios que tienen acceso al sistema.
              </CardDescription>
            </div>
            <Button onClick={() => setOpenAddDialog(true)}>
              Agregar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={deleteUser}
            currentUser={currentUser}
          />
        </CardContent>
      </Card>

      <UserFormDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        onSubmit={onAddUser}
        title="Agregar Usuario"
        description="Complete el formulario para agregar un nuevo usuario al sistema."
        submitLabel="Guardar"
      />

      <UserFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        onSubmit={onEditUser}
        title="Editar Usuario"
        description="Actualice la información del usuario."
        user={currentSelectedUser || undefined}
        submitLabel="Actualizar"
      />
    </div>
  );
};

export default UserManagement;
