export interface Formulario_Turno {
  id?: number;
  servicio_id: number; // El ID del servicio seleccionado
  cliente_id: number; // El ID que sacamos de tu authProvider (ej: id: '1')
  fecha: string; // Formato 'YYYY-MM-DD'
  hora: string; // Formato 'HH:MM'
  telefono: string; // Teléfono de contacto que le pedimos en el form
}
// Iniciamos la interfaz con datos vacios.
export const FORM_INICIAL: Formulario_Turno = {
  servicio_id: 0,
  cliente_id: 0,
  fecha: "",
  hora: "",
  telefono: "",
};

// Esto es para cuando Django nos devuelva el turno ya creado con éxito
export interface Formulario_TurnoResponse extends Formulario_Turno {
  id: number;
  nombre_servicio: string;
  nombre_barbero: string;
  estado: string; // 'pendiente', 'confirmado', etc.
  precio?: number; // Debemos asegurano que el back mande ese campo sino sacamos o ponemos undefined.
} // Recordar que ya estamos heredando del formulario prioncipal asique cuando extendemos es para agregar mas propiedades que nos devuelva el back o que necesitemos.

// Creamos una typo de contrato de error heredado del formulario
export type Errores_Formulario = Partial<
  Record<keyof Formulario_Turno, string>
>;
