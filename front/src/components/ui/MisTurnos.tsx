import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTurno from "../../hooks/useTurno";

const MisTurnos = ({ refreshTrigger }: { refreshTrigger: number }) => {
  // Estados
  // Traemos el id del cliente logueado
  const { user } = useAuth();
  const idClienteLogueado = user?.id || 0; // Obtenemos el id del usuario logueado actual.

  // Traemos todos los metodos, logica y estados del hook turnos.
  const {
    turnosCliente,
    listarTurnosCliente,
    loadingTurno,
    cancelarturnoCliente,
  } = useTurno(idClienteLogueado);
  // Este estado es para mostrar un modal de confiormacion de cancelacion de un turno.
  const [modalConfCancelar, setModalConfCancelar] = useState(false);
  const [modalCanceladoExito, setModalCanceladoExito] = useState(false);
  const [idTurno, setIdTurno] = useState(0);

  // Apenas el componente carga y tenemos el ID, mandamos a llamar a la API
  useEffect(() => {
    if (idClienteLogueado) {
      listarTurnosCliente();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idClienteLogueado, refreshTrigger]); // Si cambia de id vuelve a recargar los turnos.

  // Esta funcion manejara el cancelar turno.
  const handleCancelarTurno = async (idTurno: number) => {
    // Vamos a crear un modal de confirmar cancelacion.
    setModalConfCancelar(true);
    setIdTurno(idTurno);
  };

  const handlConfirmarCancelacion = async () => {
    // Llamamos ala api para cancelar un turno.
    const seCancelo = await cancelarturnoCliente(idTurno);

    if (seCancelo) {
      // Si Django dio el OK, volvemos a pedir los turnos para que la pantalla se actualice sola
      listarTurnosCliente();
      setIdTurno(0);
      setModalConfCancelar(false);
      setModalCanceladoExito(true);
    } else {
      // Por si las moscas, un cartelito de alerta si falló el servidor, aca vamos a replazar en el modal el error pero l dejamos por ahora.
      alert("No se pudo cancelar el turno. Intente nuevamente.");
      setIdTurno(0);
      setModalConfCancelar(false);
    }
  };

  // Aca manejamos logica de los turnos
  // TURNOS VERDADERAMENTE ACTIVOS (Están pendientes o confirmados, pero son los que TIENE QUE ASISTIR)
  const turnosProximos = turnosCliente.filter(
    (turno) => turno.estado === "pendiente" || turno.estado === "confirmado",
  );

  // HISTORIAL DE TURNOS PASADOS (Los que ya se completaron, cancelaron o vencieron)
  const turnosPasados = turnosCliente.filter(
    (turno) => turno.estado === "cancelado" || turno.estado === "finalizado", // o como llames a los turnos viejos
  );
  // AGARRAMOS SOLO LOS ÚLTIMOS 3 DEL HISTORIAL (Para no saturar la pantalla con 20 tarjetas)
  // Usamos .slice(0, 3) La API ya los devuelve ordenados del más nuevo al más viejo
  const historialLimitado = turnosPasados.slice(0, 3);

  // Evaluar los casos de renderizado
  const tieneTurnosProximos = turnosProximos.length > 0;
  const tieneHistorial = turnosPasados.length > 0;

  // Función auxiliar para darle color a las etiquetas de estado
  const obtenerBadgeEstado = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pendiente":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  // MOstrar un UI cargando de los turnos.
  if (loadingTurno) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-violet-400 font-bold animate-pulse text-lg">
          Cargando tus turnos...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 p-4 sm:p-8 flex justify-center items-start ">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-black text-white mb-2 text-center uppercase tracking-tighter">
          Mis <span className="text-violet-500">Turnos</span>
        </h1>
        <p className="text-zinc-400 text-center mb-8 text-sm">
          Gestioná tus reservas y revisá tu historial
        </p>

        {/** Esto es para mostrar modal de confirmacion de cancelar un turno */}
        {modalConfCancelar && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black max-w-sm w-full mx-6">
              <h2 className="text-2xl font-bold text-white mb-4 text-center uppercase tracking-tighter">
                Confirmar Cancelar Turno
              </h2>
              <p className="text-zinc-300 text-center text-sm">
                ¿Desea cancelar el turno?
              </p>
              <p className="text-xs text-zinc-500 text-center leading-relaxed">
                Una vez cancelado aparecerá en el historial de turnos."
              </p>
              <div className="flex justify-center items-center gap-4 pt-2">
                <button
                  type="button"
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded-full cursor-pointer transition-colors"
                  onClick={() => setModalConfCancelar(false)}
                >
                  Volver atrás
                </button>
                <button
                  type="button"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-full cursor-pointer transition-colors"
                  onClick={() => handlConfirmarCancelacion()}
                >
                  Sí, cancelar turno
                </button>
              </div>
            </div>
          </div>
        )}

        {/** Mostrar mensaje de cancelacion exitosa */}
        {modalCanceladoExito && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl shadow-black max-w-sm w-full mx-6">
              <h2 className="text-2xl font-bold text-white mb-4 text-center uppercase tracking-tighter">
                Turno Cancelado
              </h2>
              <p className="text-zinc-300 text-center text-sm">
                El turno ha sido cancelado con exito
              </p>
              <div className="flex justify-center items-center gap-4 pt-2">
                <button
                  type="button"
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 px-4 rounded-full cursor-pointer transition-colors"
                  onClick={() => setModalCanceladoExito(false)}
                >
                  Volver atrás
                </button>
              </div>
            </div>
          </div>
        )}

        {turnosCliente.length > 0 ? (
          <div>
            {tieneTurnosProximos ? (
              /* CASO 1: TIENE TURNOS ACTIVOS (Pendientes o Confirmados)*/
              <div className="space-y-10">
                <div>
                  <h2 className="text-zinc-400 font-semibold uppercase tracking-wider text-xs mb-4">
                    Próximos Turnos ({turnosProximos.length})
                  </h2>

                  {/* Grid Responsivo e inquebrantable en horizontal */}
                  <div
                    className="grid gap-6 w-full"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                    }}
                  >
                    {turnosProximos.map((turno) => (
                      <div
                        key={turno.id}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-violet-500/50 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group shadow-lg min-h-[260px]"
                      >
                        {/* Efecto glow sutil de fondo */}

                        <div className="absolute -right-10 -top-10 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all duration-300 pointer-events-none" />

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4 gap-2">
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mb-0.5">
                                #ID-{turno.id}
                              </span>
                              <h3 className="text-xl font-bold text-white tracking-tight leading-tight group-hover:text-violet-400 transition-colors duration-300 break-words">
                                {turno.nombre_servicio}
                              </h3>
                            </div>
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border uppercase tracking-wider shrink-0 h-fit ${obtenerBadgeEstado(turno.estado)}`}
                            >
                              {turno.estado}
                            </span>
                          </div>

                          {/* Datos del turno */}
                          <div className="space-y-2.5 text-sm text-zinc-300 mb-6 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/60">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base shrink-0">📅</span>
                              <span className="font-medium text-zinc-200">
                                {turno.fecha}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="text-base shrink-0">⏰</span>
                              <span className="font-bold text-white">
                                {turno.hora} hs
                              </span>
                            </div>
                            {turno.nombre_barbero && (
                              <div className="flex items-center gap-2.5 border-t border-zinc-800/40 pt-2 mt-2">
                                <span className="text-base shrink-0">💈</span>
                                <span className="text-xs text-zinc-400">
                                  Barbero:{" "}
                                  <strong className="text-white font-semibold">
                                    {turno.nombre_barbero}
                                  </strong>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* BOTÓN CANCELAR FLEXIBLE: Se muestra en Pendiente O Confirmado */}
                        {(turno.estado === "pendiente" ||
                          turno.estado === "confirmado") && (
                          <button
                            onClick={() => handleCancelarTurno(turno.id)}
                            className="w-full bg-zinc-800/60 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-700/50 hover:border-red-900/40 font-semibold py-2.5 rounded-lg text-xs transition-all duration-300 uppercase tracking-wider cursor-pointer relative z-10"
                          >
                            Cancelar Turno
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/*  Mostrar historial resumido abajo si tiene próximos turnos */}
                {tieneHistorial && (
                  <div className="pt-8 border-t border-zinc-900/80">
                    <h3 className="text-zinc-500 font-semibold uppercase tracking-wider text-[11px] mb-4">
                      Historial Reciente (Últimos {historialLimitado.length})
                    </h3>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                      {historialLimitado.map((turno) => (
                        <div
                          key={turno.id}
                          className="bg-zinc-900/20 border border-zinc-800/40 rounded-xl p-4 flex justify-between items-center opacity-60 hover:opacity-90 transition-opacity duration-300"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-zinc-300 text-sm truncate">
                              {turno.nombre_servicio}
                            </p>
                            <p className="text-zinc-500 text-xs mt-0.5">
                              📅 {turno.fecha}
                            </p>
                          </div>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 font-medium ${obtenerBadgeEstado(turno.estado)}`}
                          >
                            {turno.estado}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CASO 2: NO TIENE ACTIVOS, SOLO TIENE HISTORIAL (Se muestran max 3)*/
              <div className="max-w-4xl mx-auto">
                <h2 className="text-zinc-400 font-semibold uppercase tracking-wider text-xs mb-6 text-center">
                  Historial de turnos anteriores
                </h2>
                <div
                  className="grid gap-6 w-full"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                  }}
                >
                  {historialLimitado.map((turno) => (
                    <div
                      key={turno.id}
                      className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between opacity-80 relative overflow-hidden"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4 gap-2">
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] text-zinc-500 font-mono">
                              #ID-{turno.id}
                            </span>
                            <h3 className="text-lg font-bold text-zinc-400 tracking-tight mt-0.5 truncate">
                              {turno.nombre_servicio}
                            </h3>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border uppercase tracking-wider shrink-0 h-fit ${obtenerBadgeEstado(turno.estado)}`}
                          >
                            {turno.estado}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-zinc-400 bg-zinc-950/30 p-3 rounded-lg border border-zinc-900">
                          <div>📅 {turno.fecha}</div>
                          <div>⏰ {turno.hora} hs</div>
                          {turno.nombre_barbero && (
                            <div className="text-zinc-500 border-t border-zinc-800/30 pt-1.5 mt-1.5">
                              Atendido por:{" "}
                              <span className="text-zinc-400 font-medium">
                                {turno.nombre_barbero}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /*  CASO 3: TOTALMENTE NUEVO (Sin historial de ningún tipo) */
          <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl max-w-md mx-auto p-6">
            <span className="text-4xl block mb-3">📅</span>
            <h3 className="text-lg font-bold text-white mb-1">
              Sin historial de reservas
            </h3>
            <p className="text-zinc-500 text-sm mb-6">
              Parece que todavía no reservaste ningún turno en nuestra barbería.
            </p>
            <button className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-violet-600/20 uppercase tracking-wide cursor-pointer">
              <a href="#reservar">Reservar mi primer turno</a>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTurnos;
