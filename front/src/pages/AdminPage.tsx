import { useEffect, useState } from "react";
import usePanelAdmin from "../hooks/usePanelAdmin";
import * as TurnosContrato from "../types/interfacePanelAdmin";

const AdminPage = () => {
  //                                    Estados
  // Obtenemos todos los metodos y funciones retornado por el hooks personalizados.
  const {
    totalPagina,
    pagina,
    setPagina,
    total,
    turnos,
    loading,
    error,
    exito,
    filtro,
    stats,
    setFiltro,
    confirmarTurnoAdmin,
    finalizarTurnoAdmin,
  } = usePanelAdmin();
  // Guarda el ID del turno que se va a finalizar, o null si el modal está cerrado
  const [turnoParaFinalizar, setTurnoParaFinalizar] = useState<number | null>(
    null,
  );

  // Fecha de hoy.
  const hoy = new Date().toISOString().split("T")[0];
  // Función auxiliar para pintar el "Badge" o etiqueta del estado del turno
  const renderBadgeEstado = (estado: string) => {
    const estilos: Record<string, string> = {
      pendiente: "bg-amber-100 text-amber-800 border-amber-200",
      confirmado: "bg-emerald-100 text-emerald-800 border-emerald-200",
      finalizado: "bg-blue-100 text-blue-800 border-blue-200",
      cancelado: "bg-rose-100 text-rose-800 border-rose-200",
    };

    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${estilos[estado] || "bg-gray-100"}`}
      >
        {estado.toUpperCase()}
      </span>
    );
  };
  // Manejamos los filtro de los turnos
  const handleFiltroChange = (
    key: keyof TurnosContrato.FiltroTurnos,
    value: string,
  ) => {
    // Aca manejaremos las variables que contiene los filtros.
    setPagina(1);
    setFiltro((f) => ({ ...f, [key]: value }));
  };

  const handleFiltroReset = () => {
    // Aca manejaremos las variables que contiene los filtros.
    setPagina(1);
    setFiltro({ fecha: "", estado: "todos" }); // Esto valores son los valores por defecto
  };

  useEffect(() => {
    // Borrar si no se necesita
    /**No hay nada para mostrar u hacer.
     * se puede borrar este estado pero solo lo tenemos para ver los estados.
     */
  }, [filtro]); // Queremos que se ejecute cuando cambie el filtro.

  return (
    // Recuerda que si hay problema que se subraya la tabla o elementos es por extensiones no por codigo.
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER DEL PANEL */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {" "}
            Gestiona los turnos, clientes y la agenda de la barberia
          </p>
        </div>

        {/* Espacio reservado para acciones globales (ej: botón de Agregar Turno Manual) */}
        <div className="mt-4 md:mt-0">
          <span className="text-xs font-medium bg-slate-200 text-slate-800 px-3 py-1.5 rounded-md">
            {" "}
            Modo Administrador
          </span>
        </div>

        {/*  SECCIÓN DE STATS RAPIDAS (Futuro componente TarjetasStats) */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 select-none">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 truncate">
              Turnos Totales (Pag)
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">
              {" "}
              {totalPagina}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-medium text-slate-500 truncate">
              Pestaña Actual
            </p>
            <p className="mt-1 text-3xl font-semibold text-amber-600">
              {pagina} de {total}
            </p>
          </div>

          {/* Dejamos estos dos de muestra para cuando agregues más lógica en el back */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 opacity-60">
            <p className="text-sm font-medium text-slate-500 truncate">
              Cortes de Hoy
            </p>
            <p className="mt-1 text-3xl font-semibold text-slate-400">
              {stats.cortes_hoy}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 opacity-60">
            <p className="text-sm font-medium text-slate-500 truncate">
              Caja Estimada
            </p>
            <p className="mt-1 text-3xl font-semibold text-emerald-600">
              $ {stats.caja_estimada}
            </p>
          </div>
        </div>

        {/*  BLOQUE DE FILTROS (Futuro componente FiltrosPanel) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              Filtrar por Fecha
            </label>
            <input
              type="date"
              // Sigue bloqueando las fechas pasadas de forma nativa
              min={new Date().toISOString().split("T")[0]}
              value={filtro.fecha || ""} // Esto salva la vida cuando por error no se ingresa la fecha.
              onChange={(e) => handleFiltroChange("fecha", e.target.value)}
              className="border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              Estado
            </label>
            <select
              value={filtro.estado}
              onChange={(e) => handleFiltroChange("estado", e.target.value)}
              className="border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
            >
              <option value="todos">Todos los turnos</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmado">Confirmados</option>
              <option value="finalizado">Finalizados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>

          {/** Para mostrar botones de acciones */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              Ver hoy
            </label>
            <button
              // Filtramos solo las de hoy.
              onClick={() => handleFiltroChange("fecha", hoy)}
              className="flex px-5 py-2 text-white text-sm font-bold rounded-xl hover:bg-violet-500 active:scale-95 transition-all shadow-md shadow-indigo-200 cursor-pointer"
            >
              <span>📅</span>
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              Limpiar Filtros
            </label>
            <button
              // Filtramos solo las de hoy.
              onClick={() => handleFiltroReset()}
              className="flex items-center justify-center px-5 py-2 text-white text-sm font-bold rounded-xl hover:bg-violet-400 active:scale-95 transition-all shadow-md shadow-indigo-200 cursor-pointer"
            >
              <span>🧹</span>
            </button>
          </div>
        </div>

        {/* ALERTAS DE SISTEMA (Éxito / Error) debemos programar */}
        {exito && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
            ¡Operación realizada con éxito! La agenda fue actualizada.
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
            Hubo un error al procesar la solicitud. Reintentá en unos momentos.
          </div>
        )}
        {/* MODAL DE CONFIRMACIÓN PARA FINALIZAR */}
        {turnoParaFinalizar !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-100 transform scale-100 transition-all">
              {/* Icono de advertencia/pregunta */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <span className="text-xl">💈</span>
              </div>

              <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
                ¿Finalizar atención?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Confirmá si ya terminaste el servicio. Esto registrará el turno
                como completado en el sistema.
              </p>

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setTurnoParaFinalizar(null)} // ❌ Cancela y cierra el modal
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Volver
                </button>

                <button
                  onClick={() => {
                    // ✅ Ejecuta la lógica real usando el ID que teníamos guardado
                    finalizarTurnoAdmin(turnoParaFinalizar);
                    // 🧹 Cerramos el modal limpiando el estado
                    setTurnoParaFinalizar(null);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 cursor-pointer"
                >
                  Sí, finalizar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLA DE TURNOS PRINCIPAL */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600 select-none">
              <thead className="bg-slate-950 text-slate-200 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Nro</th>
                  <th className="px-6 py-4">Cliente / Teléfono</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Fecha / Hora</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  // Efecto Esqueleto o Spinner de carga
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-500 font-medium"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                        Buscando turnos en la base de datos...
                      </div>
                    </td>
                  </tr>
                ) : turnos.length === 0 ? (
                  // Caso sin registros
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No se encontraron turnos registrados para esta sección.
                    </td>
                  </tr>
                ) : (
                  // Mapeo real de los turnos de Django
                  turnos.map((turno) => (
                    <tr
                      key={turno.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-medium">
                          {turno.id || "Sin ID"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {turno.nombre_cliente}
                        </div>
                        <div className="text-xs text-slate-500">
                          {turno.telefono || "Sin teléfono"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-medium">
                          {turno.nombre_servicio}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">
                          {turno.fecha}
                        </div>
                        <div className="text-xs text-slate-500 font-semibold bg-slate-100 w-max px-1.5 py-0.5 rounded mt-0.5">
                          {turno.hora} hs
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {renderBadgeEstado(turno.estado)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                        {/* BOTÓN CONFIRMAR: Solo aparece si está pendiente */}
                        {turno.estado === "pendiente" && (
                          <button
                            onClick={() =>
                              turno.id && confirmarTurnoAdmin(turno.id)
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            Confirmar
                          </button>
                        )}

                        {/* BOTÓN FINALIZAR: Solo aparece si ya está confirmado */}
                        {turno.estado === "confirmado" && (
                          <button
                            onClick={() =>
                              turno.id && setTurnoParaFinalizar(turno.id)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                          >
                            Finalizar
                          </button>
                        )}

                        {/* Si está finalizado o cancelado, no mostramos acciones destructivas */}
                        {(turno.estado === "finalizado" ||
                          turno.estado === "cancelado") && (
                          <span className="text-xs text-slate-400 italic">
                            Sin acciones
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/*  CONTROLES DE PAGINACIÓN */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Mostrando página{" "}
              <span className="text-slate-800 font-bold">{pagina}</span> de{" "}
              <span className="text-slate-800 font-bold">{totalPagina}</span>
            </div>
            <div className="flex space-x-2">
              <button
                disabled={pagina <= 1 || loading}
                onClick={() => setPagina(pagina - 1)}
                className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-all"
              >
                Anterior
              </button>
              <button
                disabled={pagina >= totalPagina || loading}
                onClick={() => setPagina(pagina + 1)}
                className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
