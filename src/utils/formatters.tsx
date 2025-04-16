import { useState, useEffect } from 'react';

// Current locale (default to Colombian)
let currentLocale = 'es-CO';
let currentCurrency = 'COP';

// Function to update the locale and currency
export const updateLocaleSettings = (locale: string, currency: string) => {
  currentLocale = locale;
  currentCurrency = currency;
  console.log(`Locale settings updated: ${locale} / ${currency}`);
};

// Format a number as currency using the detected locale
export const formatCurrency = (amount: number): string => {
  // Use try-catch to handle potential number formatting errors with very large numbers
  try {
    return new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency: currentCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Ensure thousand separators are used
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currentCurrency} Error`;
  }
};

// Format a number as currency value without the currency symbol
// Ensures format is always 000.000.000.000,00 (periods for thousands, comma for decimals)
export const formatCurrencyValue = (value: number): string => {
  try {
    // Handle potentially large numbers by converting to string first
    const numberStr = value.toString();
    
    // Split into integer and decimal parts
    let integerPart = '';
    let decimalPart = '00';
    
    if (numberStr.includes('.')) {
      const parts = numberStr.split('.');
      integerPart = parts[0];
      // Ensure decimal part is always 2 digits
      decimalPart = parts[1].length > 1 ? parts[1].substring(0, 2) : parts[1].padEnd(2, '0');
    } else {
      integerPart = numberStr;
    }
    
    // Add thousand separators (periods)
    let formattedInteger = '';
    for (let i = 0; i < integerPart.length; i++) {
      if (i > 0 && (integerPart.length - i) % 3 === 0) {
        formattedInteger += '.';
      }
      formattedInteger += integerPart[i];
    }
    
    // Return with comma as decimal separator
    return `${formattedInteger},${decimalPart}`;
  } catch (error) {
    console.error('Error formatting currency value:', error);
    return '0,00';
  }
};

// Parse a formatted number (handling both comma and period decimal separators)
export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue || !formattedValue.trim()) return 0;

  // For Colombian format: Remove all periods (thousand separators) and replace comma with period for JS parsing
  const cleanValue = formattedValue.replace(/\./g, '').replace(',', '.');
  const result = parseFloat(cleanValue) || 0;
  return isNaN(result) ? 0 : result;
};

// Format a date as a local string
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Format a date with time
export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat(currentLocale, {
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
