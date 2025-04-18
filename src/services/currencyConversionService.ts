
interface ConversionResponse {
  success: boolean;
  rates: Record<string, number>;
}

// API para conversión de monedas
export const getExchangeRates = async (baseCurrency: string): Promise<Record<string, number>> => {
  try {
    // Usamos una API gratuita para obtener tasas de conversión
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const data = await response.json() as ConversionResponse;
    
    if (!data.success) {
      throw new Error('Exchange rate API returned unsuccessful response');
    }
    
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

// Función para convertir de una moneda a otra
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Si tenemos una tasa directa para la conversión
  if (rates[toCurrency]) {
    return amount * rates[toCurrency];
  }
  
  // Si no hay tasa directa, devolver 0 o manejar el error
  return 0;
};
