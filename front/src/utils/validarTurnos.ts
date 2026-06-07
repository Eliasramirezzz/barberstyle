// Este archivo se encargara de evaluar los datos del formulario y controlar que no haya errores.
import * as Turno from "../types/InterfaceTurno"; // Contrato de ts para verficiar los campos.

function validarTurnos(form: Turno.Formulario_Turno): Turno.Errores_Formulario {
  // Esto tiene que ser una funciona para retornar un parametro osea errores.
  const errores: Turno.Errores_Formulario = {};
  if (!form.servicio_id) errores.servicio_id = "Selecciona un Servicio"; // Verificar que este bien
  if (!form.cliente_id) errores.cliente_id = "Selecciona un Cliente"; // Verificar que este bien

  // La validacion de la fecha es mas compleja.
  const ahora = new Date();
  if (!form.fecha) {
    errores.fecha = "La fecha es requerida";
  } else {
    // Creamos un objeto Date con la fecha del formulario (formato YYYY-MM-DD)
    // Le sumamos "T00:00:00" para que no haya problemas de zona horaria
    const fechaSeleccionada = new Date(form.fecha + "T00:00:00");
    const hoySoloFecha = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
    );

    if (fechaSeleccionada < hoySoloFecha) {
      errores.fecha = "No podés elegir una fecha que ya pasó";
    }
  }
  // Validar Hora (Solo si la fecha es HOY) // Esto no vamos a usar creo porque los horarios nos provee el back
  if (!form.hora) {
    errores.hora = "El horario es requerido";
  } else if (form.fecha) {
    const [horas, minutos] = form.hora.split(":").map(Number);
    const fechaSeleccionada = new Date(form.fecha + "T00:00:00");
    const hoySoloFecha = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
    );

    // Si la fecha elegida es HOY, verificamos que la HORA no haya pasado
    if (fechaSeleccionada.getTime() === hoySoloFecha.getTime()) {
      const horaTurno = horas * 60 + minutos; // Convertimos todo a minutos
      const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

      if (horaTurno <= horaActual) {
        errores.hora = "Esa hora ya pasó, elegí una más tarde";
      }
    }

    // Validar el teléfono
    if (!form.telefono || form.telefono.trim() === "") {
      errores.telefono = "El telefono es requerido";
    }
  }
  // Validamos el telefono que no tenga espacios
  const telefonoLimpio = form.telefono ? form.telefono.trim() : "";

  if (!telefonoLimpio) {
    errores.telefono = "El teléfono es requerido";
  } else {
    // Expresión regular: Solo números, entre 8 y 15 caracteres
    const regexSoloNumeros = /^\d{8,15}$/;

    if (!regexSoloNumeros.test(telefonoLimpio)) {
      errores.telefono =
        "El teléfono debe contener solo números (entre 8 y 15 dígitos)";
    }
  }
  return errores;
}

export default validarTurnos;
