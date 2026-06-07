import FormularioTurno from "../components/ui/FormularioTurno";
import MisTurnos from "../components/ui/MisTurnos";
import { useState } from "react";

const TurnoPage = () => {
  // Este estado es para actualizar la pagina cuando un turno es confirmado o cancelado.
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Funcion para manejar la actualizacion de la pagina
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="pt-20 min-h-screen bg-zinc-950 px-4 text-zinc-300 flex flex-col items-center">
      <section id="mis-turnos" className="w-full max-w-6xl mx-auto ">
        <MisTurnos refreshTrigger={refreshTrigger} />
      </section>

      <section id="reservar" className="w-full max-w-lg mx-auto pb-20 pt-20">
        <FormularioTurno onTurnoCreado={handleRefresh} />
      </section>
    </div>
  );
};

export default TurnoPage;
