import { useState, useEffect, useCallback } from "react"; // El callback es para el manejo de la paginación u accion del usuario, sirbe para volver a cargar los turnos o lo que hay dentro del call. esto nos permitira persionar el bnt de confirmar, o cancelar y volver a recargar la tabla.
import adminAPI from "../api/adminAPI";
import * as PanelContrato from "../types/interfacePanelAdmin";

const usePanelAdmin = () => {
  // Estados del hook
  const [turnos, setTurnos] = useState<PanelContrato.TurnoAdmin[]>([]); // Para almacenar los turnos
  const [loading, setLoading] = useState<boolean>(false); // para informar la carga
  const [error, setError] = useState<boolean>(false); // para informar el error si es que hay
  const [exito, setExito] = useState<boolean>(false); // para msotrar el cartel de exito
  // Estado para manejar la página actual de la tabla
  const [pagina, setPagina] = useState<number>(1); // para saber la pagina actual
  const [total, setTotal] = useState<number>(0); // para saber el total de pagina y dividirla

  const [filtro, setFiltro] = useState<PanelContrato.FiltroTurnos>({
    fecha: "",
    estado: undefined,
  }); // Este contrato es para el filtrado, nos sirbe para saber la fecha, la hora y el estado del turno
  const [stats, setStats] = useState({ cortes_hoy: 0, caja_estimada: 0 });

  const totalPagina = Math.max(1, Math.ceil(total / 20));
  const Fechahoy = new Date().toISOString().split("T")[0];

  // Definimos la función (limpia, sin trucos raros adentro)
  const listarTurnoBarberia = useCallback(async () => {
    // Aca usamos el callback, no efect, el efect es quien llama en el arranque pero luego se usa el useCallback cuando detecta alguna accion dentro de ella.
    try {
      setLoading(true);
      setError(false);

      const res = await adminAPI.listarTodosLosTurnos(pagina, filtro);
      const state = await adminAPI.obtenerEstados();

      setTurnos(res.data.results); // Guardamos los turnos, recorda que el results es el array con los turnos.
      setTotal(res.data.count); // nos da el total de turnos
      setStats(state.data);

      console.log(state.data);
    } catch (error) {
      console.error("Error al traer la agenda de la barbería", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [pagina, filtro]); //Aca el useCall va a detectar que debe recargarse cuando la pagina se cambie, la pagina cambiara cuando se confirme, finalize o cancele un turno.

  // El disparador automático con el parche para ESLint 9
  useEffect(() => {
    // Envolvemos la llamada en una macro-tarea asíncrona, porque ESLint 9 (version moderna) se queja porque no le damos un respirto al useEffect apra cargar los turnos en pantalla
    const timer = setTimeout(() => {
      listarTurnoBarberia();
    }, 0);

    // Limpieza por si el barbero cierra la pestaña antes de que responda
    return () => clearTimeout(timer);
  }, [listarTurnoBarberia]);

  // Acción: Confirmar un turno
  const confirmarTurnoAdmin = async (idTurno: number) => {
    try {
      setLoading(true);
      setExito(false);
      await adminAPI.confirmarTurno(idTurno);

      setExito(true);
      await listarTurnoBarberia(); // Recargamos la lista
      return true;
    } catch (err) {
      console.error("Error al confirmar turno", err);
      setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Acción: Finalizar un turno
  const finalizarTurnoAdmin = async (idTurno: number) => {
    try {
      setLoading(true);
      setExito(false);
      await adminAPI.finalizarTurno(idTurno);

      setExito(true); // Todo salio de 10.
      await listarTurnoBarberia();
      return true;
    } catch (err) {
      console.error("Error al finalizar turno", err);
      setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    turnos, // Exportamos los turnos
    loading, // Exportamos el loading
    error, // Exportamos el error
    exito, // Exportamos el exito
    total, // Exportamos el total de turnos
    pagina, // Lo exportamos para manejar las paginas.
    setPagina, // Lo exportamos para usarlo en los botones de paginación
    totalPagina, // Para mostrar el total de paginas
    Fechahoy, // Para filtrar los turnos por fecha
    listarTurnoBarberia, // Para recargar los turnos
    confirmarTurnoAdmin, // Para confirmar un turno (para uso de los btns)
    finalizarTurnoAdmin, // Para finalizar un turno (para uso de los btns)
    filtro, // Para manejar el filtro
    setFiltro, // Para cambiar algun filtro.
    stats, // Para manejar las estadisticas
  };
};

export default usePanelAdmin;
