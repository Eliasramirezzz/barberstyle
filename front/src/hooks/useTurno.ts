import { useState, useEffect } from "react";
import * as Turno from "../types/InterfaceTurno";
import turnoAPI from "../api/turnoAPI";

// En el es estado de cargar el formualrio inicial y el id del cliente o token lo que vamos hacer para que sea mas limpio el codigo vamos a crear una funcion fuera del componente, esto ayuda a que no se ejecute todo el bloque cada ves que renderizamos el componente y ademas hacemos mas limpio la logica.
const obtenerFormularioInicial = () => {
  // Buscamo el usuario logueado en el almacenamiento del navegador
  const localUser = localStorage.getItem("user");

  // Si existe lo transformamos en objeto, si no, queda en null
  const userParsed = localUser ? JSON.parse(localUser) : null;

  // Retornamos el objeto inicial completo para el formulario
  return {
    ...Turno.FORM_INICIAL,
    // Usamos el ID del localStorage si existe. Si justo se borró, usa el parámetro.
    cliente_id: userParsed ? userParsed.id : null,
  };
};

const useTurno = (clienteId: number) => {
  // Estado principal del formulario, le pasamos el id del usuario logeado si hay, metodo sinior usamos la funcion  que definimos afuera osea "obtenerFormularioInicial"
  const [datasForm, setDatasForm] = useState<Turno.Formulario_Turno>(
    obtenerFormularioInicial,
  );

  //  Estados para las horas que devuelve Django y respuestas de la API
  const [horariosLibres, setHorariosLibres] = useState<string[]>([]); // Estado para los horarios.
  const [loadingHorario, setLoadingHorario] = useState<boolean>(false); // Esto es para saber si estamos cargando el horario y evitar doble carga.
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false); // Esto es para manejar el envio y evitar doble click del usuario.
  const [loadingTurno, setLoadingTurno] = useState<boolean>(false); // Nos sirbe para mostrar el loading cuando carga los turnos de un cliente.
  const [error, setError] = useState<string | null>(null); // Estado para manejar los errores.
  const [exito, setExito] = useState<boolean>(false); // Estado para manejar los exitos.
  const [turnosCliente, setTurnosCliente] = useState<
    Turno.Formulario_TurnoResponse[]
  >([]); // Este estado no va a permitir guardar los turnos encontrados del cliente en la bd.

  //  Manejador de cambios genérico para inputs (teléfono, fecha, servicio, hora)
  const handleChange = (name: keyof Turno.Formulario_Turno, value: unknown) => {
    // Si el input que está cambiando es la FECHA, hacemos el control de fin de semana
    if (name === "fecha" && value) {
      // Creamos un objeto Date agregando la hora local para evitar desfases horarios
      const fechaSeleccionada = new Date(value + "T00:00:00");
      const diaSemana = fechaSeleccionada.getDay(); // 0 = Domingo, 6 = Sábado

      // Si el día cae un Sábado (6) o un Domingo (0)
      if (diaSemana === 0 || diaSemana === 6) {
        // Guardamos el cartel de advertencia en el estado general de errores globales
        setError("Los sábados y domingos la barbería permanece cerrada.");

        // Limpiamos la fecha y la hora en el estado del formulario para que queden vacíos
        setDatasForm((prev) => ({
          ...prev,
          fecha: "",
          hora: "",
        }));
        return; // Clavamos el freno de mano acá para que no guarde el fin de semana
      }
    }

    //  Si pasa el filtro (o si es otro input cualquiera), guardamos los datos en el estado
    if (name === "servicio_id" || name === "fecha") {
      // Si cambia el servicio o la fecha, actualizamos ese campo y reseteamos la hora vieja obligatoriamente
      setDatasForm((prev) => ({ ...prev, [name]: value, hora: "" }));
    } else {
      // Si cambia cualquier otra cosa (como el teléfono o la hora), lo guardamos normal
      setDatasForm((prev) => ({ ...prev, [name]: value }));
    }

    //Limpiamos los errores del estado para que desaparezcan los carteles de alerta al escribir de nuevo
    setError(null);
  };

  //  REACCIÓN AUTOMÁTICA: Cada vez que cambie la fecha o el servicio, buscamos los horarios libres
  useEffect(() => {
    const buscarHorarios = async () => {
      // Solo ejecutamos si el cliente ya eligió una fecha Y un servicio válido
      if (!datasForm.fecha || datasForm.servicio_id === 0) {
        setHorariosLibres([]);
        return;
      }
      // Caso de que todo esté ok, buscamos los horarios libres
      try {
        setLoadingHorario(true); // Activamos el loading
        setError(null);
        // Llamamos ala APi limpia de axion
        const res = await turnoAPI.obtenerHorariosDisponibles(
          datasForm.fecha,
          datasForm.servicio_id,
        );
        // Obtenemos los horarios libres.
        setHorariosLibres(res.data);
      } catch {
        setError("No se pudieron obtener horarios para esta fecha.");
        setHorariosLibres([]);
      } finally {
        setLoadingHorario(false); // Desactivamos el loading
      }
    };
    buscarHorarios();
  }, [datasForm.fecha, datasForm.servicio_id]); // Quedamos escuchando esos dos datos si se modifican se recarga el estado con el componente.

  //  Función para enviar el formulario a Django (POST)
  const registrarTurno = async () => {
    // Hacemos la Peticion
    try {
      setLoadingSubmit(true);
      setError(null);
      // Mandamos los datos limpios mapeados para Django
      await turnoAPI.crear(datasForm);
      setExito(true);

      return true; //  Retornamos true para avisarle al componente que la API grabó joya
    } catch (error) {
      console.log("Error al registrar turno:", error);
      return false; // Retornamos false si Django rebotó la petición
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetearFormulario = () => {
    // Reiniciamos el formulario pero conservando el cliente_id
    setDatasForm({ ...Turno.FORM_INICIAL, cliente_id: clienteId }); // Mantenemos el ID del cliente logueado
    setHorariosLibres([]); // Limpiamos los horarios.

    // Limpiamos los errores del servidor para que no traben el flujo
    setError(null);
  };

  // Creamos este metodo de listar un turno.
  const listarTurnosCliente = async () => {
    try {
      setLoadingTurno(true);
      const res = await turnoAPI.listarTurnoCliente();
      // tenemos que verificar la respuesta si viene o no apginado y si viene el result que es el array que nos interesa
      // // Si por alguna razón no viniera paginado, usamos res.data por respaldo.
      const listaDeTurnos = res.data.results || res.data;
      setTurnosCliente(listaDeTurnos);
      setLoadingTurno(false);
      setExito(true);
      return true; // Debemos avisarle al componente que salio todo bien.
    } catch (error: unknown) {
      console.log("Error al listar turnos del cliente", error);
      return false;
    } finally {
      setLoadingTurno(false);
    }
  };

  // Este metodo es para cancelar turno de un cliente.
  const cancelarturnoCliente = async (idTurno: number) => {
    // Peticion de cancelar turno
    try {
      setLoadingTurno(true);
      // Ejecutamos el PATCH pasándole el id y, opcionalmente, el nuevo estado en el body
      await turnoAPI.cancelarTurno(idTurno);
      return true; // Retornamos true si Django respondió joya
    } catch (error: unknown) {
      console.log("Error al cancelar turno del cliente", error);
      return false; // Retornamos false si se pinchó
    } finally {
      setLoadingTurno(false);
    }
  };

  // Retornamos todo lo que el componente del diseño va a necesitar explotar
  return {
    datasForm, // Para que el componente maneje el formulario.
    turnosCliente, // Para mostrar los turnos del cliente.
    horariosLibres, // Para que sepa que horarios libres hay.
    loadingHorario, // Para que carge el horario
    loadingSubmit, // Para que maneje el envio.
    loadingTurno, // Para manejar la carga de los turnos.
    error, // Para mostrar error.
    exito, // Para mostrar el mensaje de exito.
    setExito, // Por si queremos meter un botón de "Aceptar" que cierre un modal
    handleChange, // Para el manejo de cambios.
    registrarTurno, // Para el registro.
    resetearFormulario, // Para limpiar el formulario.
    listarTurnosCliente, // Para listar los turnos.
    cancelarturnoCliente, // Es para cancelar un turno.
  };
};

export default useTurno;
