
interface CurrencyInfo {
  name: string;
  symbol: string;
}

export const currencyMap: Record<string, CurrencyInfo> = {
  "USD": { name: "US Dollar", symbol: "$" },
  "EUR": { name: "Euro", symbol: "€" },
  "GBP": { name: "British Pound", symbol: "£" },
  "JPY": { name: "Japanese Yen", symbol: "¥" },
  "COP": { name: "Peso Colombiano", symbol: "$" },
  "MXN": { name: "Peso Mexicano", symbol: "$" },
  "CLP": { name: "Peso Chileno", symbol: "$" },
  "ARS": { name: "Peso Argentino", symbol: "$" },
  "PEN": { name: "Sol Peruano", symbol: "S/" },
  "BRL": { name: "Real Brasileño", symbol: "R$" },
  "BOB": { name: "Boliviano", symbol: "Bs" },
  "VES": { name: "Bolívar Venezolano", symbol: "Bs" },
  "UYU": { name: "Peso Uruguayo", symbol: "$" },
  "PYG": { name: "Guaraní Paraguayo", symbol: "₲" },
  "CAD": { name: "Canadian Dollar", symbol: "$" },
  "AUD": { name: "Australian Dollar", symbol: "$" },
  "CNY": { name: "Chinese Yuan", symbol: "¥" },
  "INR": { name: "Indian Rupee", symbol: "₹" },
};

export const getCurrencyInfo = (code: string): CurrencyInfo => {
  return currencyMap[code] || { name: code, symbol: code };
};

export const getCurrencySymbol = (code: string): string => {
  return getCurrencyInfo(code).symbol;
};

export const getCurrencyName = (code: string): string => {
  return getCurrencyInfo(code).name;
};
