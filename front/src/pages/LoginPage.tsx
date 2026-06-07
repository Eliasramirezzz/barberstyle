import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // Estados para manejo del login
  const { login, token, user, error, loading } = useAuth(); // Usamos el hook, pero no usamos state, usamos los objetos dentro del state como error, token, etc.

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messajeError, setMessajeError] = useState("");

  const navigate = useNavigate(); // Para navegar entre paginas

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessajeError("Todos los campos son obligatorios");
      return;
    }

    // Ejecutamos la función login que programamos en el AuthProvider
    await login(email, password);
  };

  useEffect(() => {
    if (token && user && !error) {
      // Verificamos el rol que decodificó jwtDecode
      if (user.rol === "admin" || user.rol === "barbero") {
        navigate("/admin");
      } else {
        navigate("/turnos");
      }
    }
  }, [token, user, error, navigate]);

  return (
    // Contenedor principal con fondo oscuro para que combine con tu landing
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-20">
      <div className="max-w-md w-full bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenido a Barber
            <span className="text-violet-500">Style</span>{" "}
          </h1>
          <p className="text-gray-400">
            Ingresa tus credenciales para reservar tu turno
          </p>
        </div>

        {/* Mostrar cartel si hay error en el servidor */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-600"
              placeholder="usuario@gmail.com"
              disabled={loading}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Contraseña
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all placeholder-gray-600"
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {/* Recordarme */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-700 bg-[#1a1a1a] text-purple-600 focus:ring-purple-600"
              />
              <label htmlFor="remember" className="ml-2 text-gray-400">
                Recordarme
              </label>
            </div>
            <a
              href="#"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              ¿Olvidaste tu clave?
            </a>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            className="flex items-center w-full py-3 justify-center  bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/20 transition-all transform active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              // Ruedita de carga Premium metida adentro del botón centrado
              <div className="flex items-center justify-center animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        {/* Mensaje de error general*/}
        {messajeError ? (
          <div className="bg-red-500 text-white py-2 px-4 rounded-lg mt-4">
            {messajeError}
          </div>
        ) : (
          ""
        )}

        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <span className="text-gray-400 text-sm">¿No tienes una cuenta?</span>
          <button className="ml-2 text-purple-500 font-medium hover:underline transition-all">
            Registrarme
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
