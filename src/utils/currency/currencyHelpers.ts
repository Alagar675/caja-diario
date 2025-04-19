
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
  "CHF": { name: "Swiss Franc", symbol: "CHF" },
  "SGD": { name: "Singapore Dollar", symbol: "S$" },
  "HKD": { name: "Hong Kong Dollar", symbol: "HK$" },
  "SEK": { name: "Swedish Krona", symbol: "kr" },
  "NOK": { name: "Norwegian Krone", symbol: "kr" },
  "DKK": { name: "Danish Krone", symbol: "kr" },
  "PLN": { name: "Polish Złoty", symbol: "zł" },
  "ZAR": { name: "South African Rand", symbol: "R" },
  "AED": { name: "UAE Dirham", symbol: "د.إ" },
  "SAR": { name: "Saudi Riyal", symbol: "﷼" },
  "RUB": { name: "Russian Ruble", symbol: "₽" },
  "TRY": { name: "Turkish Lira", symbol: "₺" },
  "KRW": { name: "South Korean Won", symbol: "₩" },
  "ILS": { name: "Israeli New Shekel", symbol: "₪" },
  "NZD": { name: "New Zealand Dollar", symbol: "NZ$" },
  "THB": { name: "Thai Baht", symbol: "฿" },
  "IDR": { name: "Indonesian Rupiah", symbol: "Rp" },
  "MYR": { name: "Malaysian Ringgit", symbol: "RM" },
  "PHP": { name: "Philippine Peso", symbol: "₱" },
  "TWD": { name: "New Taiwan Dollar", symbol: "NT$" },
  "CZK": { name: "Czech Koruna", symbol: "Kč" },
  "HUF": { name: "Hungarian Forint", symbol: "Ft" },
  "ISK": { name: "Icelandic Króna", symbol: "kr" },
  "DOP": { name: "Dominican Peso", symbol: "RD$" },
  "CRC": { name: "Costa Rican Colón", symbol: "₡" },
  "GTQ": { name: "Guatemalan Quetzal", symbol: "Q" },
  "HNL": { name: "Honduran Lempira", symbol: "L" },
  "NIO": { name: "Nicaraguan Córdoba", symbol: "C$" },
  "PAB": { name: "Panamanian Balboa", symbol: "B/" },
  "TTD": { name: "Trinidad and Tobago Dollar", symbol: "TT$" },
  "JMD": { name: "Jamaican Dollar", symbol: "J$" },
  "UAH": { name: "Ukrainian Hryvnia", symbol: "₴" },
  "RON": { name: "Romanian Leu", symbol: "lei" },
  "BGN": { name: "Bulgarian Lev", symbol: "лв" },
  "EGP": { name: "Egyptian Pound", symbol: "£" },
  "MAD": { name: "Moroccan Dirham", symbol: "د.م." }
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
