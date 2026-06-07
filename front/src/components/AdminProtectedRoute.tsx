// Este archivo tambien es para protejer rutas, pero aca solo dejamos que el admin puede acceder al panel o rutas que le dejemos.
import type React from "react"; // Necesario para tipar el tema del children.
import { Navigate } from "react-router-dom"; // Vamos a usar para redirijir.
import useAuth from "../hooks/useAuth";

// Este contrato es para aplicar a todos los compoenentes hijos que eeste protegido.
export interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  // Traemos la función isAdmin del conexto de authenticacion
  const { isAdmin } = useAuth();
  const token = localStorage.getItem("token"); // Obtenemos el token del navegador.

  // Si no tiene token o no esta logeado le mandamos a la landing.
  if (!token) {
    return <Navigate to="/" replace />; // Replace es para no guardar la ruta en el historial.
  }

  // Si TIENE token, pero NO ES ADMIN, lo mandamos a su panel de clientes.
  if (!isAdmin()) {
    return <Navigate to="/turnos" replace />;
  }

  //  Si tiene token y ES admin, lo dejamos pasar al panel.
  return <>{children}</>;
};

export default AdminProtectedRoute;
