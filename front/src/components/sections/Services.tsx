import { ServiceCard } from "../ui/ServiceCard";
import useService from "../../hooks/useService";

const Services = () => {
  const { servicios, loading, error } = useService();

  // Una capa de UX profesional por si el backend tarda en responder
  if (loading) {
    return (
      <div className="bg-black py-24 text-center text-white font-medium">
        Cargando los mejores estilos de Chaco...
      </div>
    );
  }

  // Si hay un error
  if (error) {
    return (
      <div className="bg-black py-24 text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  return (
    <section id="services" className=" bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-violet-500 font-bold tracking-widest uppercase text-sm mb-2">
            Nuestros Servicios
          </h2>
          <h3 className="text-4xl font-black text-white uppercase">
            Elegí tu <span className="text-violet-500">Estilo</span>
          </h3>
        </div>

        {/* Tarjetas de Servicios, pero verficamos si hay servicios o no*/}
        {servicios.length === 0 && (
          <div className="bg-black py-24 text-center text-white font-medium">
            No hay servicios disponibles, por favor, vuelva mas tarde
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicios.map((serv) => {
            // Si tiene imagen de Django, le pegamos el localhost:8000 adelante.
            // Si NO tiene, usamos la ruta interna del frontend relativa a la carpeta 'public' o 'assets'
            const urlImagenReal = serv.imagen
              ? `${serv.imagen}`
              : "/ImgServices/corte_cabello.png"; // Imagen por defecto por si no cargaste una en el admin

            return (
              <ServiceCard
                key={serv.id}
                {...serv}
                imagen={urlImagenReal} // Le sobreescribimos la URL completa para el tag <img>
                barberName={serv.nombre_barbero || "Barbero General"} // Usamos directo el campo que calculó Django!
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
