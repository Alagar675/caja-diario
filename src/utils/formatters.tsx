
// Format a number as currency (COP - Colombian Pesos)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format a date as a local string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Format a date with time
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date(date));
};

// Get current date in YYYY-MM-DD format for input fields
export const getCurrentDateForInput = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Get time in HH:MM format for input fields
export const getCurrentTimeForInput = (): string => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Generate PDF (simulated)
export const generatePDF = (content: string, filename: string): void => {
  // In a real app, this would use a library like jspdf
  console.log(`Generating PDF with content: ${content}`);
  
  // Mock download dialog
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Print document (simulated)
export const printDocument = (content: string): void => {
  // In a real app, this would use the browser's print API
  console.log(`Printing document with content: ${content}`);
  
  // Create a printable area
  const printWindow = window.open('', '', 'height=600,width=800');
  if (printWindow) {
    printWindow.document.write('<html><head><title>Imprimir</title>');
    printWindow.document.write('<style>@media print { @page { margin: 0.5cm; } }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  }
};
