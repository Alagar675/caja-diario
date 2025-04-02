
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimeFieldsProps {
  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
}

const DateTimeFields = ({
  date,
  setDate,
  time,
  setTime
}: DateTimeFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Input 
          id="date" 
          type="date" 
          required 
          value={date} 
          onChange={e => setDate(e.target.value)} 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="time">Hora</Label>
        <Input 
          id="time" 
          type="time" 
          required 
          value={time} 
          onChange={e => setTime(e.target.value)} 
        />
      </div>
    </div>
  );
};

export default DateTimeFields;
