import { useState, useEffect } from "react";
import serviceAPI from "../api/serviceAPI";
import type { InterfaceServices as Servicios } from "../types/InterfaceServices";

const useService = () => {
  const [servicios, setServicios] = useState<Servicios[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const CargarServicios = async () => {
      try {
        const res = await serviceAPI.listar(); // Hacemos la peticion
        const dataAPI = res.data; // Obtenemos los datos

        //  CONTROL PROFESIONAL: Evaluamos la estructura de forma nativa
        if (Array.isArray(dataAPI)) {
          // Caso A: Django devolvió el array limpio directamente
          setServicios(dataAPI);
        } else if (
          dataAPI &&
          "results" in dataAPI &&
          Array.isArray(dataAPI.results)
        ) {
          // Caso B: Django devolvió el objeto paginado (extraemos los 'results')
          setServicios(dataAPI.results);
        } else {
          // Caso C: Fallback de seguridad por si viene un formato inesperado
          setServicios([]);
        }
      } catch {
        setError("Error al cargar los servicios");
        setServicios([]); // Evita que la app quede en estado inconsistente
      } finally {
        setLoading(false);
      }
    };

    CargarServicios();
  }, []);

  return { servicios, loading, error };
};

export default useService;
