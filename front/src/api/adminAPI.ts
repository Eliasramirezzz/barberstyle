// Este archivo es el que conecta el END-POINT del back con el front.
import client from "./client";
import * as ContratoTurno from "../types/interfacePanelAdmin";

const adminAPI = {
  // Este metodo es para listar todos los turnos y el admin es quien va a usar no el cliente.
  listarTodosLosTurnos: (
    pagina: number,
    filtros?: ContratoTurno.FiltroTurnos,
  ) => {
    // Puede aver filtro como no por eso el filtros?.
    // Antes de hacer la peticion verificamos si hay filtrosa, empezamos obteniedo la url primero.
    const params = new URLSearchParams();
    // Antes de agregar los filtros agregamos la pagina.
    params.append("page", pagina.toString()); // Recordemos que el toString() es para convertir el numero en string

    // Primero vamos a verificar la fecha que haya una fecha.
    if (filtros?.fecha) {
      // Fi hay fecha le agregamos al params.
      params.append("fecha", filtros.fecha);
    }

    // Filtro inteligente.
    if (filtros?.estado && filtros.estado !== "todos") {
      // esto me tira: Unexpected any. Specify a different type.
      params.append("estado", filtros.estado);
    }

    // Retornamos la respuesta de la peticion armada con los filtros.
    return client.get(`/turnos/?${params.toString()}`); // Aca tambien debemos la url entera en string.
  }, // Importante por parametro pasamos la pagina y los parametros que necesitemos.

  // Este metodo es para confirmar un turno al cliente.
  confirmarTurno: (idTurno: number) =>
    client.patch(`/turnos/${idTurno}/confirmar/`),

  // Este metodo es para cambiar el estado de confirmado a finalizado.
  finalizarTurno: (idTurno: number) =>
    client.patch(`/turnos/${idTurno}/finalizar/`),

  // Obtenemos los estados de los turnos.
  obtenerEstados: () => client.get("/turnos/dashboard-stats/"),
};

export default adminAPI;
