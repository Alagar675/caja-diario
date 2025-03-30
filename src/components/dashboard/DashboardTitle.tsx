
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";

interface DashboardTitleProps {
  initialTitle?: string;
}

const DashboardTitle: React.FC<DashboardTitleProps> = ({ 
  initialTitle = "Informe financiero del día" 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [editing, setEditing] = useState(false);
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  return (
    <div className="w-full py-4 bg-white dark:bg-gray-950">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-2xl font-bold border-b-2 border-blue-500 outline-none bg-transparent w-full"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleEditing}
                  className="h-8 w-8"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {title}
                </h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleEditing}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 flex items-center">
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
