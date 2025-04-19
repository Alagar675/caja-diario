
import { useState, useEffect } from "react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["user", "admin"]),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState<User | null>(null);
  const { register: registerUser, user: currentUser } = useAuth();

  const loadUsers = () => {
    const usersStr = localStorage.getItem("app_users");
    if (usersStr) {
      try {
        const userData = JSON.parse(usersStr);
        const sanitizedUsers = userData.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        }));
        setUsers(sanitizedUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    } else {
      setUsers([]);
    }
  };

  const onAddUser = async (data: UserFormData) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success("Usuario agregado exitosamente");
      setOpenAddDialog(false);
      loadUsers();
      return true;
    } catch (error: any) {
      toast.error("Error al agregar usuario: " + error.message);
      return false;
    }
  };

  const onEditUser = async (data: UserFormData) => {
    if (!currentSelectedUser) return false;
    
    try {
      const usersStr = localStorage.getItem("app_users");
      if (!usersStr) return false;
      
      const allUsers = JSON.parse(usersStr);
      const userIndex = allUsers.findIndex((u: any) => u.id === currentSelectedUser.id);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
        return false;
      }
      
      allUsers[userIndex] = {
        ...allUsers[userIndex],
        name: data.name,
        email: data.email,
        role: data.role,
        ...(data.password ? { password: data.password } : {}),
      };
      
      localStorage.setItem("app_users", JSON.stringify(allUsers));
      toast.success("Usuario actualizado exitosamente");
      setOpenEditDialog(false);
      loadUsers();
      return true;
    } catch (error: any) {
      toast.error("Error al actualizar usuario: " + error.message);
      return false;
    }
  };

  const deleteUser = (userId: string) => {
    try {
      const usersStr = localStorage.getItem("app_users");
      if (!usersStr) return;
      
      const allUsers = JSON.parse(usersStr);
      const adminUsers = allUsers.filter((u: any) => u.role === "admin");
      const deletingUser = allUsers.find((u: any) => u.id === userId);
      
      if (adminUsers.length === 1 && deletingUser.role === "admin") {
        toast.error("No se puede eliminar al único administrador");
        return;
      }
      
      if (currentUser && deletingUser.id === currentUser.id) {
        toast.error("No puedes eliminar tu propio usuario");
        return;
      }
      
      const updatedUsers = allUsers.filter((u: any) => u.id !== userId);
      
      localStorage.setItem("app_users", JSON.stringify(updatedUsers));
      toast.success("Usuario eliminado exitosamente");
      loadUsers();
    } catch (error: any) {
      toast.error("Error al eliminar usuario: " + error.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
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
  };
};
