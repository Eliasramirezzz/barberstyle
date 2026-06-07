// En este archivos debemos hacer dos cosas, crear ele turno y pedir turnos, al back
// Importamos los contratos
import * as Turno from "../types/InterfaceTurno";
import client from "./client";

const turnoAPI = {
  // Crear el turno
  crear: (data: Turno.Formulario_Turno) => {
    const DatosParaDjango = {
      servicio: data.servicio_id,
      cliente: data.cliente_id,
      fecha: data.fecha,
      hora: data.hora,
      telefono: data.telefono,
    };
    // Le agregamos el tipo de respuesta para tener autocompletado en el front
    return client.post<Turno.Formulario_TurnoResponse>(
      "/turnos/",
      DatosParaDjango,
    );
  },
  // Traer os horarios disponibles.
  obtenerHorariosDisponibles: (fecha: string, servicio_id: number) =>
    client.get<string[]>(`/turnos/horario-disponible/`, {
      params: {
        fecha,
        servicio: servicio_id,
      },
    }),

  // Traer los turnos de un cliente.
  listarTurnoCliente: () => client.get(`/turnos/`),

  // Para cancelar un turno
  cancelarTurno: (id: number) => client.patch(`/turnos/${id}/cancelar/`),
  // El método PATCH se usa en REST para modificar un solo campo de un registro sin tener que mandarle todo el objeto completo
};

export default turnoAPI;
