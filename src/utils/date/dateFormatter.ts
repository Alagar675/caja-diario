
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

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

export const getCurrentDateForInput = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const getCurrentTimeForInput = (): string => {
  const date = new Date();
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

let currentLocale = 'es-CO'; // Share the same locale setting

export const updateLocale = (locale: string) => {
  currentLocale = locale;
};
