
interface CountryInfo {
  name: string;
  defaultCurrency: string;
}

export const countryMap: Record<string, CountryInfo> = {
  "US": { name: "United States", defaultCurrency: "USD" },
  "GB": { name: "United Kingdom", defaultCurrency: "GBP" },
  "ES": { name: "Spain", defaultCurrency: "EUR" },
  "DE": { name: "Germany", defaultCurrency: "EUR" },
  "FR": { name: "France", defaultCurrency: "EUR" },
  "IT": { name: "Italy", defaultCurrency: "EUR" },
  "JP": { name: "Japan", defaultCurrency: "JPY" },
  "CO": { name: "Colombia", defaultCurrency: "COP" },
  "MX": { name: "Mexico", defaultCurrency: "MXN" },
  "CL": { name: "Chile", defaultCurrency: "CLP" },
  "AR": { name: "Argentina", defaultCurrency: "ARS" },
  "PE": { name: "Peru", defaultCurrency: "PEN" },
  "BR": { name: "Brazil", defaultCurrency: "BRL" },
  "BO": { name: "Bolivia", defaultCurrency: "BOB" },
  "VE": { name: "Venezuela", defaultCurrency: "VES" },
  "UY": { name: "Uruguay", defaultCurrency: "UYU" },
  "PY": { name: "Paraguay", defaultCurrency: "PYG" },
  "CA": { name: "Canada", defaultCurrency: "CAD" },
  "AU": { name: "Australia", defaultCurrency: "AUD" },
  "CN": { name: "China", defaultCurrency: "CNY" },
  "IN": { name: "India", defaultCurrency: "INR" },
};

export const getCountryInfo = (code: string): CountryInfo => {
  return countryMap[code] || { name: code, defaultCurrency: "USD" };
};

export const getCountryName = (code: string): string => {
  return getCountryInfo(code).name;
};

export const getDefaultCurrencyForCountry = (code: string): string => {
  return getCountryInfo(code).defaultCurrency;
};
