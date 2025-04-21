import React from "react";
const DashboardTitle = ({
  initialTitle
}: {
  initialTitle?: string;
}) => {
  return <h1 className="text-2xl font-bold mb-6 text-green-900 text-center">
      Bienvenido a Daily Cash Report
    </h1>;
};
export default DashboardTitle;