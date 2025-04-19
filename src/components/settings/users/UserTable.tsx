
import { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Shield, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  currentUser?: User | null;
}

const UserTable = ({ users, onEdit, onDelete, currentUser }: UserTableProps) => {
  const isAdminUser = (user: User) => {
    return user.name.toLowerCase().includes("alirio") || user.role === "admin";
  };

  return (
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
                {isAdminUser(user) && (
                  <Shield className="h-4 w-4 text-purple-600" aria-label="Usuario Administrador Principal" />
                )}
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`capitalize font-medium ${user.role === "admin" ? "text-purple-600" : "text-green-600"}`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(user.id)}
                  disabled={isAdminUser(user) && user.name === "Alirio Aguirre Ariza"}
                  aria-label={isAdminUser(user) && user.name === "Alirio Aguirre Ariza" ? 
                    "No se puede eliminar al administrador principal" : 
                    "Eliminar usuario"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UserTable;
