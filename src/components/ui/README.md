
# Componentes de UI para Caja Diario

## input-monetario-global

Este componente proporciona un campo de entrada para valores monetarios con las siguientes características:

- Entrada de derecha a izquierda (formato típico de moneda)
- Formato automático de:
  - Separador de miles con punto (.)
  - Separador decimal con coma (,)
  - Muestra siempre dos decimales
- Limitado a 25 caracteres numéricos
- Solo permite ingresar números
- Acepta valores con decimales automáticamente

### Ejemplo de uso

```jsx
import { CurrencyInputField } from "@/components/ui/currency-input-field";

const MyComponent = () => {
  const [value, setValue] = React.useState("");
  
  return (
    <CurrencyInputField 
      value={value} 
      onChange={setValue} 
      label="Monto a pagar"
      showFeedback={true}
    />
  );
};
```

### Componentes disponibles

1. **CurrencyInputField**: Componente base para entrada de moneda
2. **EnhancedCurrencyInput**: Versión mejorada con detección de moneda local
3. **TransactionCurrencyInput**: Especializado para transacciones

### Utilidades relacionadas

El componente utiliza las siguientes funciones de utilidad:

- `formatCurrencyInput`: Da formato al valor ingresado
- `stripNonNumeric`: Elimina caracteres no numéricos
- `parseCurrencyValue`: Convierte el valor formateado a número

