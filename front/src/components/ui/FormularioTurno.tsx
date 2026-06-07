import { useState } from "react";
import * as Turnos from "../../types/InterfaceTurno";
import useTurno from "../../hooks/useTurno";
import useService from "../../hooks/useService";
import useAuth from "../../hooks/useAuth";
import validarTurnos from "../../utils/validarTurnos";

const FormularioTurno = ({ onTurnoCreado }: { onTurnoCreado: () => void }) => {
  // Obtenemos el id del usuario logueado
  const { user } = useAuth();
  const idClienteLogueado = user?.id || 0;
  // Manejo de estado
  const {
    datasForm,
    horariosLibres,
    loadingHorario,
    loadingSubmit,
    error: errorServer,
    exito,
    setExito,
    handleChange,
    registrarTurno,
    resetearFormulario,
  } = useTurno(idClienteLogueado);
  const { servicios, loading: loadingServicios } = useService(); // Cargamos cortes reales
  const [errores, setErrores] = useState<Turnos.Errores_Formulario>({});
  const [modalExito, setModalExito] = useState(false);
  const [modalConfirmacion, setModalConfirmacion] = useState(false);

  // El formulario SÓLO valida y abre el primer modal de confirmación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Unico evento de envio del formulario para todos los hijos.
    // Primero verificamos errores, validamos el front.
    const nuevosErrores = validarTurnos(datasForm);
    // Menjo el objeto de errores.
    if (Object.keys(nuevosErrores).length > 0) {
      // Si hay error lo pasamos el formulario de error.
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});

    // Si no hay errores, simplemente abrimos el modal de confirmación
    setModalConfirmacion(true);
  };

  // Esta función SÓLO se ejecuta cuando el cliente le da "Confirmar" adentro del modal
  const handleConfirmarReserva = async () => {
    // Cerramos el modal de confirmación inmediatamente
    setModalConfirmacion(false);
    // Mandamos los datos a Django
    const seGuardo = await registrarTurno();

    // Si salió todo joya, abrimos el modal de éxito
    if (seGuardo) {
      setModalExito(true);
    }
  };

  // Función interna para limpiar la pantalla al cerrar el modal
  const handleCerrarModalYLimpiar = () => {
    // Cerramos el modal primero
    setModalExito(false);
    if (onTurnoCreado) {
      onTurnoCreado();
    }
    // Reseteamos TODO el formulario y las horas libres de un solo viaje
    resetearFormulario();
    // Limpiamos los errores de validación local (front) para que no jodan en el próximo turno
    setErrores({});
    // Dejamos el temporizador para limpiar el cartel verde de éxito
    setTimeout(() => {
      setExito(false);
    }, 3000);
  };

  return (
    <div>
      {/* Título con estilo más agresivo/moderno */}
      <h1 className="text-4xl font-black text-white mb-8 text-center uppercase tracking-tighter">
        Reservar <span className="text-violet-500">Turno</span>
      </h1>
      {errorServer && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-semibold">
          {errorServer}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black"
      >
        {/* SELECT SERVICIOS */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="servicio_id"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400"
          >
            Seleccione el Servicio
          </label>
          <select
            name="servicio_id"
            value={datasForm.servicio_id}
            onChange={
              (e) => handleChange("servicio_id", Number(e.target.value))
              // Lo que hacemos es usar el manejo de cambio que tenemos en el hook de turnos. le pasamos el id del servicio que esta seleccionado, lo convertimos a numero por si esta en otro formato y obteneos con el e.target.value el valor de ese campo osea el numero id de ese servicio.
            }
            className={`w-full bg-zinc-800 border ${
              errores.servicio_id ? "border-red-500" : "border-zinc-700"
            } rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer`}
          >
            <option value={0}>-- Elija un corte o estilo --</option>
            {loadingServicios ? (
              <option disabled>Cargando servicios...</option>
            ) : (
              servicios.map((serv) => (
                <option key={serv.id} value={serv.id}>
                  {serv.nombre} (${serv.precio.toLocaleString("es-AR")})
                </option>
              ))
              // recorremos los servicios, a cada servicios osea serv.id guardamos su identificador osea key y el valor que va a tener es el del id. mostramos el nombre, y el precio argentino.
            )}
          </select>
          {errores.servicio_id && (
            <span className="text-red-500 text-xs mt-1">
              {errores.servicio_id}
            </span>
          )}
        </div>

        {/* INPUT FECHA */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="fecha"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400"
          >
            Ingrese una fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={datasForm.fecha}
            // Ejecuta nuestra función que frena los sábados y domingos al toque
            onChange={(e) => handleChange("fecha", e.target.value)}
            // Sigue bloqueando las fechas pasadas de forma nativa
            min={new Date().toISOString().split("T")[0]}
            className={`w-full bg-zinc-800 border ${
              errores.fecha ? "border-red-500" : "border-zinc-700"
            } rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all`}
          />
          {/* Si intentó elegir fin de semana, acá saltará el cartel rojo explicativo */}
          {errores.fecha && (
            <span className="text-red-500 text-xs mt-1">{errores.fecha}</span>
          )}
        </div>

        {/* INPUT HORA */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="hora"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400"
          >
            {loadingHorario
              ? "Buscando huecos libres..."
              : "Seleccione un horario disponible"}
          </label>
          <select
            name="hora"
            value={datasForm.hora}
            onChange={(e) => handleChange("hora", e.target.value)}
            disabled={horariosLibres.length === 0 || loadingHorario}
            className={`w-full bg-zinc-800 border ${
              errores.hora ? "border-red-500" : "border-zinc-700"
            } rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {horariosLibres.length === 0 ? (
              <option value="">
                {/* NUEVA LÓGICA DE CARTEL: Si hay un error de fecha por fin de semana, avisamos directo en el select */}
                {errores.fecha && errores.fecha.includes("cerrada")
                  ? "Fines de semana cerrados"
                  : datasForm.fecha && datasForm.servicio_id !== 0
                    ? "No hay horarios disponibles"
                    : "Complete servicio y fecha primero"}
              </option>
            ) : (
              <>
                <option value="">-- Seleccione una hora --</option>
                {horariosLibres.map((horaString) => (
                  <option key={horaString} value={horaString}>
                    Disponible: {horaString} hs
                  </option>
                ))}
              </>
            )}
          </select>
          {errores.hora && (
            <span className="text-red-500 text-xs mt-1">{errores.hora}</span>
          )}
        </div>

        {/* INPUT TELEFONO */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="telefono"
            className="text-xs font-bold uppercase tracking-wider text-zinc-400"
          >
            Ingrese su Teléfono
          </label>
          <input
            type="text"
            name="telefono"
            value={datasForm.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            placeholder="3644119988 (sin guiones)"
            required
            className={`w-full bg-zinc-800 border ${
              errores.telefono ? "border-red-500" : "border-zinc-700"
            } rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all`}
          />
          {errores.telefono && (
            <span className="text-red-500 text-xs mt-1">
              {errores.telefono}
            </span>
          )}
        </div>
        {exito && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 p-4 rounded-xl mb-6 text-center text-sm font-semibold">
            ¡Turno reservado con éxito! Te esperamos.
          </div>
        )}
        {/* BOTÓN DE ENVÍO */}
        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800/50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-900/20 uppercase tracking-widest mt-4 active:scale-95 cursor-pointer flex justify-center items-center"
        >
          {loadingSubmit ? (
            <div className="flex items-center justify-center animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Confirmar reserva"
          )}
        </button>
      </form>

      {/* MODAL DE CONFIRMACIÓN (Flotando arriba del formulario)*/}
      {modalConfirmacion && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black max-w-sm w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4 text-center uppercase tracking-tighter">
              Confirmar Turno
            </h2>
            <p className="text-zinc-300 text-center text-sm">
              ¿Desea confirmar el turno?
            </p>
            <p className="text-xs text-zinc-500 text-center leading-relaxed">
              Una vez confirmado solo se puede cancelar desde la sección "Mis
              Turnos"
            </p>
            <div className="flex justify-center items-center gap-4 pt-2">
              <button
                type="button"
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 px-4 rounded-full cursor-pointer transition-colors"
                onClick={() => setModalConfirmacion(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="flex-1 bg-violet-600 hover:bg-violet-800 text-white font-bold py-2.5 px-4 rounded-full cursor-pointer transition-colors"
                onClick={handleConfirmarReserva} // La función limpia que creamos antes
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ÉXITO (Solo procesa las fechas si se activa) */}
      {modalExito &&
        (() => {
          // 🌟 Calculamos las variables de fecha de forma segura ACÁ ADENTRO
          const diaString = new Date(datasForm.fecha).toLocaleDateString(
            "es-ES",
            { weekday: "long" },
          );
          const diaNumero = new Date(datasForm.fecha).getDate(); // Con .getDate() te da el nro de mes real (1 al 31)
          const MesString = new Date(datasForm.fecha).toLocaleDateString(
            "es-ES",
            { month: "long" },
          );

          return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black max-w-sm w-full mx-4 text-center">
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">
                  Turno <span className="text-violet-500">Reservado</span> con
                  éxito
                </h2>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  Turno reservado para el día{" "}
                  <span className="font-semibold text-violet-400 capitalize">
                    {diaString} {diaNumero} de {MesString}
                  </span>{" "}
                  a las{" "}
                  <span className="font-bold text-white bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {datasForm.hora} hs
                  </span>
                </p>

                <p className="text-zinc-400 text-sm">¡Te esperamos!</p>

                <div className="flex justify-center items-center pt-2">
                  <button
                    type="button"
                    className="w-full bg-violet-500 hover:bg-violet-600 text-white font-bold py-2.5 px-4 rounded-full cursor-pointer transition-all uppercase tracking-wider text-xs"
                    onClick={handleCerrarModalYLimpiar}
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default FormularioTurno;
