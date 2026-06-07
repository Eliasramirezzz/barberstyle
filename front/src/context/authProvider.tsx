import { useReducer } from "react";
import AuthReducer from "./authReducer";
import { jwtDecode } from "jwt-decode";
import client from "../api/client";
import * as Auth from "../types/auth";
import { AuthContext } from "./authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//  Creamos una función para leer el localStorage AL TOQUE antes de que React renderice y evitar desfase de tiempo en renderizar la pagina, le creamos afuera porque es el que le vamos a pasar primeramente al reducer que es el que maneja el estado.
// Recibe el estado inicial base y lo transforma antes del primer render, tambien Valida la expiración del token antes de revivir al usuario
const inicializarAuth = (estadoInicial: Auth.authState): Auth.authState => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
    try {
      // Decodificamos el token para revisar su fecha de expiración
      const payload = jwtDecode<Auth.CustomJwtPayload>(token);
      const ahora = Date.now() / 1000; // Tiempo actual en segundos

      // Si el token ya expiró (exp es menor al tiempo actual)
      if (payload.exp && payload.exp < ahora) {
        console.warn("El token ha expirado. Limpiando sesión vieja...");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        return estadoInicial; // Retorna el estado vacío (visitante anónimo)
      }

      // Si el token sigue vigente, lo dejamos pasar joya
      return {
        ...estadoInicial,
        token,
        user: JSON.parse(user),
        loading: false,
        error: null,
      };
    } catch {
      // Si el token está corrupto o se editó mal, limpiamos todo por seguridad
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      return estadoInicial;
    }
  }
  return estadoInicial;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(
    AuthReducer,
    Auth.AUTH_INICIAL,
    inicializarAuth,
  ); // useReducer usamos en ves de useState, el useReduce nos permite manejar estados complejos que cremos nosotro en otro archivo en este caso AuthReducer.
  const navigate = useNavigate(); // Esto nos va a servir para llevarlo a la alnding si no tiene un token.

  // Si no esta logeado pasamos al proceso de login y aca hacemos nuestra peticion al servidor con axios.
  const login = async (email: string, password: string) => {
    // Prendemos el cargador y hacemos el login.
    dispatch({ type: "LOGIN_START" });

    // Dentro del login (osea cuando se le llame) hacemos la peticion al backend y controlamos en catch.
    try {
      // Llamada al back
      const res = await client.post("/auth/token/", {
        email: email,
        password,
      });
      // Ahora desenpaquetamos y tomamos el token de acceso y refresco
      const { access, refresh } = res.data;

      // Guardamos nuestro token en el navegador
      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);

      // Vamos a decodificar el token para obtener los datos del usuario
      const payload = jwtDecode<Auth.CustomJwtPayload>(access); // Usamos la libreria jwtDecode.
      // Como se ve usamos el contrato de CustomJwtPayload que definimos para que coincida con el back y no romperse en produccion.

      // Y guardamos al usuario en el navegador.
      const user: Auth.User = {
        id: payload.user_id,
        email: email,
        rol: payload.rol, // Leemos el rol del payload que viene del back
        nombre: payload.nombre,
      };

      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: access, user: user }, // Recordamos que asignamos al user del payloades el user del navegador
      });
    } catch (error: unknown) {
      //  Cambiamos 'any' por 'unknown', el unlnown le decimos queno sabemos que tipo de error podemos tener.

      let mensajeAmigable = "Ocurrió un error inesperado. Inténtalo de nuevo.";

      //  Usamos el guardián de tipo de Axios para asegurarnos de qué tipo de objeto es
      if (axios.isAxiosError(error)) {
        // Ahora dentro de este bloque, TypeScript SABE que 'error' tiene 'response' y 'request'
        if (error.response) {
          if (error.response.status === 401) {
            mensajeAmigable = "Correo electrónico o contraseña incorrectos.";
          } else if (error.response.status === 404) {
            mensajeAmigable =
              "El servicio de autenticación no se encuentra disponible.";
          }
        } else if (error.request) {
          // Si la petición se mandó pero el back de Django está apagado
          mensajeAmigable =
            "No se pudo conectar con el servidor. Verifica tu conexión.";
        }
      } else if (error instanceof Error) {
        // Por si es un error nativo de JavaScript (ej. un error de código interno)
        mensajeAmigable = `Error interno: ${error.message}`;
      }

      dispatch({
        type: "LOGIN_ERROR",
        payload: mensajeAmigable,
      });
    }
  };

  // Creamos el proceso de logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    // Al salir le mandamos directo a la pantalla principal 'landing'
    navigate("/");
  };

  // Para que el contexto no tire error por el tema de isAdmin hacemos esto
  const isAdmin = () => state.user?.rol === "admin";

  // Aca Creamos el proveedor de contexto.
  return (
    <AuthContext.Provider value={{ ...state, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
// Importante envolver todo el login en el main.tsx
