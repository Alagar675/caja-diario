
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
export const formatCurrencyValue = (value: number): string => {
  try {
    // Use the native Intl formatter for consistent locale-specific formatting
    return new Intl.NumberFormat(currentLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true, // Use thousand separators
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency value:', error);
    return '0,00';
  }
};

// Parse a formatted number (handling both comma and period decimal separators)
export const parseCurrencyValue = (formattedValue: string): number => {
  if (!formattedValue || !formattedValue.trim()) return 0;

  // Get decimal and thousand separators for the current locale
  const format = new Intl.NumberFormat(currentLocale);
  const parts = format.formatToParts(1234.5);
  const decimalSeparator = parts.find(part => part.type === 'decimal')?.value || ',';
  const groupSeparator = parts.find(part => part.type === 'group')?.value || '.';

  // Handle right-to-left input (starting with decimals)
  if (formattedValue.startsWith(decimalSeparator) || formattedValue === decimalSeparator) {
    formattedValue = '0' + formattedValue;
  }

  // Remove all non-digit characters except decimal separator
  let cleanValue = formattedValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
  
  // Handle decimal part
  if (cleanValue.endsWith(decimalSeparator)) {
    cleanValue += '00';
  } else if (cleanValue.includes(decimalSeparator)) {
    const parts = cleanValue.split(decimalSeparator);
    if (parts[1].length === 0) {
      cleanValue += '00';
    } else if (parts[1].length === 1) {
      cleanValue += '0';
    }
  }
  
  // If using period as decimal separator (e.g., en-US)
  if (decimalSeparator === '.') {
    return parseFloat(cleanValue) || 0;
  } 
  // If using comma as decimal separator (e.g., es-CO)
  else {
    return parseFloat(cleanValue.replace(decimalSeparator, '.')) || 0;
  }
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
