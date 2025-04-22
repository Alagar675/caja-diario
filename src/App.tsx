import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CurrencySettings from "./pages/CurrencySettings";
import AdminSettings from "./pages/AdminSettings";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { PublicRoute, ProtectedRoute } from "./components/routes";

// Importar las nuevas páginas de centro de costos
import CostCenterRegister from "./pages/CostCenterRegister";
import CostCenterSelect from "./pages/CostCenterSelect";
import CostCenterReport from "./pages/CostCenterReport";

function App() {
  return (
    <div className="antialiased text-gray-800 font-sans max-w-screen">
      <Toaster richColors={true} closeButton />

      <AuthProvider>
        <FinanceProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              
              {/* Nuevas rutas para centro de costos */}
              <Route path="/cost-center/register" element={<CostCenterRegister />} />
              <Route path="/cost-center/select" element={<CostCenterSelect />} />
              <Route path="/cost-center/reports" element={<CostCenterReport />} />
              
              <Route path="/settings/currency" element={<CurrencySettings />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
            
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </FinanceProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
