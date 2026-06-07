import ImgHero from "../../assets/portada_hero.png";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full flex items-center pt-20 overflow-hidden bg-black"
    >
      {/* Overlay de fondo para el toque violeta */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-violet-950/40 z-0"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        {/* Columna Izquierda: Texto */}
        <div className="space-y-6">
          <h2 className="text-violet-500 font-bold tracking-[0.2em] uppercase text-sm">
            Expertos en Estilo
          </h2>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase">
            Corta con lo <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-purple-600">
              Tradicional
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Un espacio diseñado para el hombre moderno. Calidad, precisión y una
            experiencia única en cada corte.
          </p>
          <div className="flex gap-4 pt-4">
            <NavLink
              to="/login"
              className="bg-violet-700 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-violet-900/20 transition-all uppercase text-sm tracking-widest"
            >
              Reservar Turno
            </NavLink>
            <a href="#services" className="flex items-center">
              <button className="border border-violet-500/50 hover:bg-violet-500/10 text-white font-bold py-4 px-8 rounded-lg transition-all uppercase text-sm tracking-widest">
                Ver Servicios
              </button>
            </a>
          </div>
        </div>

        {/* Columna Derecha: Imagen/Logo Principal */}
        <div className="hidden md:flex justify-center relative">
          {/* Círculo de brillo violeta atrás de la imagen */}
          <div className="absolute w-72 h-72 bg-violet-600/20 blur-[100px] rounded-full"></div>
          <img
            src={ImgHero}
            alt="Barber Principal"
            className="relative w-full max-w-md object-contain drop-shadow-[0_35px_35px_rgba(139,92,246,0.3)]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
