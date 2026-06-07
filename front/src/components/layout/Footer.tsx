import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-violet-900/20 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* 1. BRANDING - Ahora a la izquierda y con más peso */}
          <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              BARBER<span className="text-violet-600">STYLE</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[250px]">
              Definiendo el estilo de Chaco desde 2025. Calidad técnica y
              vanguardia en cada corte.
            </p>
          </div>

          {/* 2. ENLACES RÁPIDOS */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-[0.2em] text-xs">
              Explorar
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="/#hero"
                  className="text-zinc-500 hover:text-violet-400 transition-colors text-sm"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-zinc-500 hover:text-violet-400 transition-colors text-sm"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="/#about"
                  className="text-zinc-500 hover:text-violet-400 transition-colors text-sm"
                >
                  Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* 3. CONTACTO Y REDES */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-[0.2em] text-xs">
              Contacto
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group"
              >
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-violet-600/20 transition-colors">
                  <FaInstagram className="text-lg group-hover:text-violet-400" />
                </div>
                <span className="text-sm italic">@barberstyle_chaco</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group"
              >
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-violet-600/20 transition-colors">
                  <FaFacebook className="text-lg group-hover:text-violet-400" />
                </div>
                <span className="text-sm italic">Barber Style Oficial</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group"
              >
                <div className="p-2 bg-zinc-900 rounded-lg group-hover:bg-violet-600/20 transition-colors">
                  <FaWhatsapp className="text-lg group-hover:text-violet-400" />
                </div>
                <span className="text-sm italic">+54 3644 123456</span>
              </a>
            </div>
          </div>

          {/* 4. UBICACIÓN (Extra para rellenar el grid) */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-bold uppercase tracking-[0.2em] text-xs">
              Ubicación
            </h3>
            <p className="text-zinc-500 text-sm italic leading-relaxed">
              Presidencia Roque Sáenz Peña,
              <br />
              Chaco, Argentina.
            </p>
          </div>
        </div>

        {/* LÍNEA DIVISORIA Y COPYRIGHT */}
        <div className="border-t border-zinc-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">
            © {currentYear} BarberStyle - Todos los derechos reservados
          </span>
          <span className="text-zinc-600 text-[10px] uppercase tracking-[0.3em]">
            Desarrollado por{" "}
            <span className="text-violet-500 font-bold hover:text-violet-400 cursor-pointer transition-colors">
              Elias Ramirez
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
