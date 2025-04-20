
import React from "react";
import { Users } from "lucide-react";

const AdminHeader = () => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Users className="h-6 w-6 text-primary" />
      <h1 className="text-3xl font-bold">Panel de Administrador</h1>
    </div>
  );
};

export default AdminHeader;
