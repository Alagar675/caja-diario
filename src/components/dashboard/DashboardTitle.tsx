
import React from "react";
import { useAuth } from "../../context/AuthContext";

const DashboardTitle = ({
  initialTitle
}: {
  initialTitle?: string;
}) => {
  const { user } = useAuth();
  const userName = user?.name || 'Usuario';

  return (
    <h1 className="text-2xl font-bold mb-6 text-green-900 text-center">
      Bienvenido, {userName}, a Daily Cash Report
    </h1>
  );
};

export default DashboardTitle;
