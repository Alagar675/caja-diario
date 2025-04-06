
import { useState } from "react";
import { format } from "date-fns";
import { TransactionType } from "@/types/finance";
import { formatCurrency, printDocument, generatePDF } from "@/utils/formatters";

export const useReportManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportType, setReportType] = useState("daily");
  const [outputFormat, setOutputFormat] = useState<"print" | "pdf">("print");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | "all">("all");

  return {
    selectedDate,
    setSelectedDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportType,
    setReportType,
    outputFormat,
    setOutputFormat,
    selectedCategory,
    setSelectedCategory,
    selectedTransactionType,
    setSelectedTransactionType
  };
};

export default useReportManagement;
