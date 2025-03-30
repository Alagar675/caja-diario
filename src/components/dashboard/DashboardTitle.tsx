
import React, { useState, useEffect } from "react";

interface DashboardTitleProps {
  initialTitle?: string;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({ 
  initialTitle = "Informe financiero del día" 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Actualizar la fecha y hora cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date): string => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatTime = (date: Date): string => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full py-8 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {initialTitle}
          </h1>
          <div className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md flex gap-2">
            <span className="text-gray-600 dark:text-gray-300">Fecha: {formatDate(currentDate)}</span>
            <span className="text-gray-500 dark:text-gray-400">|</span>
            <span className="text-gray-600 dark:text-gray-300">Hora: {formatTime(currentDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTitle;
