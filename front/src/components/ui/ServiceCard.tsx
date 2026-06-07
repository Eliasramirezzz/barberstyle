import { Clock, User } from "lucide-react"; // Libreria modernas de iconos
import type { InterfaceServices } from "../../types/InterfaceServices";

// Este metodo sirve para agregar datos a nuestro contrato sin afectar al que nos proveen, ademas podemos manipular estos datos en nuestro compoenente
interface CardProps extends InterfaceServices {
  barberName?: string;
}

export const ServiceCard = ({
  // Este metodo de separar el props de los parametros de la tarjeta se conoce como desestructuracion
  nombre,
  precio,
  duracion,
  destacado,
  barberName,
  imagen,
}: CardProps) => {
  // Ya no uso InterfaceServices sino CardProps que hereda de InterfaceServices
  return (
    <div
      className={`relative bg-neutral-900 border ${destacado ? "border-violet-500" : "border-violet-900/20"} p-8 rounded-2xl hover:translate-y-[-5px] transition-all duration-300 group`}
    >
      {/* Badge de Destacado */}
      {destacado && (
        <span className="absolute -top-3 left-6 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-violet-900/40">
          Recomendado
        </span>
      )}

      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors uppercase">
          {nombre}
        </h4>
        <span className="text-violet-500 font-black text-xl">
          ${precio.toLocaleString("es-AR")}
        </span>
      </div>

      {/* Contenedor para la imagen con overflow-hidden para los bordes */}
      <div className="w-full overflow-hidden rounded-xl mb-6 border border-violet-900/10">
        <img
          src={imagen}
          alt={nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          // Esto hace que la foto se acerque un poquito cuando pasas el mouse
        />
      </div>

      {/** La descripcion la sacamos por ahora en l imagen ya tiene la descripcion 
       * <p className="text-gray-400 text-sm leading-relaxed mb-6 h-12 line-clamp-2">
              {descripcion}
            </p>
      */}

      <div className="flex items-center justify-between pt-6 border-t border-violet-900/20">
        {/* Info del Barbero */}
        <div className="flex items-center gap-2 text-gray-300">
          <div className="p-1.5 bg-violet-500/10 rounded-md">
            <User size={14} className="text-violet-500" />
          </div>
          <span className="text-xs font-medium">
            {barberName || "Barbero General"}
          </span>
        </div>

        {/* Duración */}
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={14} />
          <span className="text-xs">{duracion} min</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
