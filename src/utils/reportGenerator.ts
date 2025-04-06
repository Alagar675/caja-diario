
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency, printDocument, generatePDF } from "@/utils/formatters";
import { DailySummary } from "@/types/finance";

export const generateFinancialReport = (
  dailySummary: DailySummary,
  incomeCategories: { category: string; total: number }[],
  expenseCategories: { category: string; total: number }[],
  selectedDate: Date,
  selectedCategory: string,
  selectedTransactionType: string,
  outputFormat: "print" | "pdf"
) => {
  const reportDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
    locale: es
  });
  const printDateTime = format(new Date(), "dd/MM/yyyy HH:mm:ss", {
    locale: es
  });
  const categoryFilter = selectedCategory !== "all" ? `<h3 class="text-center">Filtrado por categoría: ${selectedCategory}</h3>` : '';
  const typeFilter = selectedTransactionType !== "all" ? `<h3 class="text-center">Tipo: ${selectedTransactionType === "income" ? "Ingresos" : "Egresos"}</h3>` : '';
  let reportContent = `
    <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; position: relative;">
      <div style="position: absolute; top: 20px; right: 20px; font-size: 12px; color: #666;">
        Impreso: ${printDateTime}
      </div>
      <h1 style="text-align: center;">Reporte Financiero</h1>
      <h2 style="text-align: center;">${reportDate}</h2>
      ${categoryFilter}
      ${typeFilter}
      
      <div style="margin-top: 20px;">
        <h3>Resumen del día</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Concepto</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Monto</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Ingresos en efectivo</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalIncomeCash)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Ingresos por transferencia</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalIncomeTransfer)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Total ingresos</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.totalIncome)}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Egresos en efectivo</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalExpenseCash)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Egresos por transferencia</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(dailySummary.totalExpenseTransfer)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">Total egresos</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.totalExpense)}</strong></td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Balance del día</strong></td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;"><strong>${formatCurrency(dailySummary.balance)}</strong></td>
          </tr>
        </table>
      </div>
      
      <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <div style="width: 48%;">
          <h3>Ingresos por categoría</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Categoría</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
            ${incomeCategories.map(cat => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${cat.category}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(cat.total)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div style="width: 48%;">
          <h3>Egresos por categoría</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #f2f2f2;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Categoría</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total</th>
            </tr>
            ${expenseCategories.map(cat => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${cat.category}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(cat.total)}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
      
      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
        <p>Generado el ${format(new Date(), "dd/MM/yyyy 'a las' HH:mm:ss", {
    locale: es
  })}</p>
      </div>
    </div>
  `;
  if (outputFormat === "print") {
    printDocument(reportContent);
  } else {
    generatePDF(reportContent, `reporte-financiero-${format(selectedDate, "yyyy-MM-dd")}.pdf`);
  }
};
