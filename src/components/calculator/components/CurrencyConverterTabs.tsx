
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CurrencyConverterTabs = () => {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="change">Cambio</TabsTrigger>
      <TabsTrigger value="currency">Conversor</TabsTrigger>
    </TabsList>
  );
};
