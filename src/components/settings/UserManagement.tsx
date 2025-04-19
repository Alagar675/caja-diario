
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
import { useAuth } from "@/context/AuthContext";
import { Trash2, Edit, Shield } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserGender } from "@/utils/userUtils";

const userFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["user", "admin"]),
});

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

const UserManagement = () => {
  const { register: registerUser, user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentSelectedUser, setCurrentSelectedUser] = useState<UserData | null>(null);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const usersStr = localStorage.getItem("app_users");
    if (usersStr) {
      try {
        const userData = JSON.parse(usersStr);
        // Filter out password field for security
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

  const onAddUser = async (data: z.infer<typeof userFormSchema>) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success("Usuario agregado exitosamente");
      reset();
      setOpenAddDialog(false);
      loadUsers();
    } catch (error: any) {
      toast.error("Error al agregar usuario: " + error.message);
    }
  };

  const onEditUser = async (data: z.infer<typeof userFormSchema>) => {
    if (!currentSelectedUser) return;
    
    try {
      // Get all users
      const usersStr = localStorage.getItem("app_users");
      if (!usersStr) return;
      
      const allUsers = JSON.parse(usersStr);
      const userIndex = allUsers.findIndex((u: any) => u.id === currentSelectedUser.id);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
        return;
      }
      
      // Update user (keeping the password if not changed)
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
      reset();
      loadUsers();
    } catch (error: any) {
      toast.error("Error al actualizar usuario: " + error.message);
    }
  };

  const deleteUser = (userId: string) => {
    try {
      // Get all users
      const usersStr = localStorage.getItem("app_users");
      if (!usersStr) return;
      
      const allUsers = JSON.parse(usersStr);
      
      // Check if trying to delete the only admin
      const adminUsers = allUsers.filter((u: any) => u.role === "admin");
      const deletingUser = allUsers.find((u: any) => u.id === userId);
      
      if (adminUsers.length === 1 && deletingUser.role === "admin") {
        toast.error("No se puede eliminar al único administrador");
        return;
      }
      
      // Check if trying to delete current user
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

  const editUser = (user: UserData) => {
    setCurrentSelectedUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", ""); // Don't set password for security
    setValue("role", user.role);
    setOpenEditDialog(true);
  };

  const isAdminUser = (user: UserData) => {
    return user.name.toLowerCase().includes("alirio") || user.role === "admin";
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
            <Button onClick={() => {
              reset();
              setOpenAddDialog(true);
            }}>
              Agregar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 italic text-muted-foreground">
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center gap-2">
                      {isAdminUser(user) && <Shield className="h-4 w-4 text-purple-600" title="Usuario Administrador Principal" />}
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`capitalize font-medium ${user.role === "admin" ? "text-purple-600" : "text-green-600"}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => editUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteUser(user.id)}
                        disabled={isAdminUser(user) && user.name === "Alirio Aguirre Ariza"}
                        title={isAdminUser(user) && user.name === "Alirio Aguirre Ariza" ? "No se puede eliminar al administrador principal" : ""}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Usuario</DialogTitle>
            <DialogDescription>
              Complete el formulario para agregar un nuevo usuario al sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddUser)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre del usuario"
                {...registerForm("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...registerForm("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                {...registerForm("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select defaultValue="user" onValueChange={val => setValue("role", val as "admin" | "user")}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Actualice la información del usuario.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditUser)} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                placeholder="Nombre del usuario"
                {...registerForm("name")}
                disabled={currentSelectedUser?.name === "Alirio Aguirre Ariza"}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Correo electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="correo@ejemplo.com"
                {...registerForm("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Nueva contraseña"
                {...registerForm("password")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select 
                defaultValue={currentSelectedUser?.role || "user"} 
                onValueChange={val => setValue("role", val as "admin" | "user")}
                disabled={currentSelectedUser?.name === "Alirio Aguirre Ariza"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
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

export default UserManagement;
