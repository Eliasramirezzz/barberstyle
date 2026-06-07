import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  // Estados para manejo del nav
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Manejamos la pagina al salir de la seccion de login
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Diseño para los nav links
  const linkStyles =
    "hover:text-violet-400 transition-colors uppercase text-gray-400 text-xs font-semibold tracking-widest";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-violet-900/30 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/src/assets/icono.png" alt="Logo" className="w-8 h-8" />
        <span className="text-white font-bold uppercase text-sm tracking-widest">
          Barber<span className="text-violet-500">Style</span>
        </span>
      </div>

      {/* Menú de Navegación Dinámico */}
      <ul className="hidden md:flex gap-8 items-center">
        {/** Caso de que el usuario no este logeado le mostramos la landing nomas */}
        {!user && (
          <>
            {" "}
            <li>
              <a href="/#hero" className={linkStyles}>
                Inicio
              </a>
            </li>
            <li>
              <a href="/#services" className={linkStyles}>
                Servicios
              </a>
            </li>
            <li>
              <a href="/#about" className={linkStyles}>
                Nosotros
              </a>
            </li>
          </>
        )}

        {/** Caso de que el usuario este logeado le mostramos para reservar turno */}
        {user && user.rol === "cliente" && (
          <>
            <li>
              <a href="#mis-turnos" className={linkStyles || ""}>
                {" "}
                Mis turnos
              </a>
            </li>
            <li>
              <a href="#reservar" className={linkStyles || ""}>
                🗓️ Reservar Turno
              </a>
            </li>
          </>
        )}
        {/** Caso de que el usuario sea admin le mostramos el dasboard de turnos */}
        {user && user.rol === "admin" && (
          <ul>
            <li>
              <Link to="/dashboard-turnos" className={linkStyles || ""}>
                Dashboard
              </Link>
            </li>
          </ul>
        )}
      </ul>

      {/* Contenedor del Login */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm hidden md:inline">
              Hola,{" "}
              <span className="text-white font-medium">
                {user.nombre || user.email}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-950/40 border border-red-700/50 hover:bg-red-900/50 text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-violet-700 hover:bg-violet-600 text-white text-xs font-bold py-2 px-6 rounded-full transition-all"
          >
            INICIAR SESIÓN
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
