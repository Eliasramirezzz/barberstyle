// Contrato principal para los turnos que el admin manipulara
export interface TurnoAdmin {
  id?: number;
  servicio_id?: number;
  cliente_id?: number;
  nombre_cliente: string;
  nombre_servicio: string;
  fecha: string;
  hora: string;
  telefono: string;
  estado: "pendiente" | "confirmado" | "finalizado" | "cancelado";
}

// Este contrato en realidad es un typo de dato es para el filtrado.
export type FiltroTurnos = {
  fecha?: string;
  estado?:
    | "pendiente"
    | "confirmado"
    | "finalizado"
    | "cancelado"
    | "todos"
    | undefined;
};

// Este contrato es para obtener la respuesta del back
export interface TurnoAdminResponse {
  turnos: TurnoAdmin[];
}
