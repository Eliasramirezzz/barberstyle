import { useContext } from "react";
import { AuthContext } from "../context/authContext"; // Asegurate que AuthContext esté exportado

// Creamos una antena general para que cualquiera que llame al authContexto pueda usar este archivo en el pryecto.
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export default useAuth;
