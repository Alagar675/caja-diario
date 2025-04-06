
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useLocaleDetection } from './hooks/useLocaleDetection.tsx';
import { updateLocaleSettings } from './utils/formatters.tsx';

// Locale Provider Component
function LocaleProvider({ children }: { children: React.ReactNode }) {
  const localeInfo = useLocaleDetection();
  
  // Update locale settings when detection completes
  React.useEffect(() => {
    if (!localeInfo.loading) {
      updateLocaleSettings(localeInfo.locale, localeInfo.currencyCode);
      
      // Log detection results
      console.log(`Detected locale: ${localeInfo.locale}`);
      console.log(`Detected country: ${localeInfo.country}`);
      console.log(`Detected currency: ${localeInfo.currency} (${localeInfo.currencyCode})`);
      
      // Store in localStorage for persistence
      localStorage.setItem('detectedLocale', JSON.stringify(localeInfo));
    }
  }, [localeInfo.loading, localeInfo.locale, localeInfo.currencyCode]);

  // Display loading or error state if needed
  if (localeInfo.loading) {
    // Don't block rendering, just continue with default locale
    return <>{children}</>;
  }

  // Render children with detected locale
  return <>{children}</>;
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </React.StrictMode>
);
