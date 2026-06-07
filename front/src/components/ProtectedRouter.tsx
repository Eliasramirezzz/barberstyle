import type React from "react";
import { Navigate } from "react-router-dom";

// Contrato para aplicar a todo el react u proyecto.
export interface ProtectedRouterProps {
  children: React.ReactNode; // el componente de la página que protege
}

const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
  // Por ahora vamos a leer el token que esta en el localstore.
  const token = localStorage.getItem("token");

  if (!token) {
    // No autenticado → redirige a la landing y NO guarda esta ruta en el historial
    return <Navigate to="/" replace />;
  }
  // Autenticado → renderiza la página normalmente
  return <>{children}</>;
};

export default ProtectedRouter;
