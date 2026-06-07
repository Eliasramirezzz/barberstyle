// Este archivos es la conexion en general necesario para reducir codigo y hacer escalable la app.
import axios from "axios";

// Creamos el encabezado principal.
const client = axios.create({
  //Definimos la ruta base
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api", // Esto es para poder usar en desarrollo o produccion.
  headers: { "Content-Type": "application/json" },
});

// Creamos el control de salida (Inter ceptor de Request)
client.interceptors.request.use((config) => {
  // Primero obtenermos el token del navegador.
  const token = localStorage.getItem("token");

  // Verficiamos si tiene algun valor el token
  if (token) {
    // Inyectamos el token en la cabecera del paquete
    config.headers.Authorization = `Bearer ${token}`; // Importante que coincida el 'Bearer' con el que programamos en el base u dev en el back..
  }
  return config;
});

// Creamos el control de entrada  (Interceptor de Request)
client.interceptors.response.use(
  (response) => response, // Si la respuesta es correcta, deja pasar el paquete
  (error) => {
    // En caso de que haya error.
    // Si Django nos tira un 401 (No autorizado / Token vencido)
    if (error.response?.status === 401) {
      // Limpiamos las llaves CORRECTAS del localStorage
      localStorage.removeItem("token"); // Eliminamos el token
      localStorage.removeItem("refresh"); // Limpiamos también el de refresco por las dudas
      localStorage.removeItem("user"); // Limpiamos el usuario tambien.

      const rutaActual = window.location.pathname; // Obtenemos la ruta actual para saber si estamos en el login o no y poder manejarlo.
      // Solo redirige si NO está en el login Y tampoco está en la landing pública "/"
      if (!rutaActual.includes("/login") && rutaActual !== "/") {
        // Truco Sinior jajaja
        window.location.href = "/login";
      }
    }
    return Promise.reject(error); // En caso de que hay un error, lo devolvemos
  },
);

export default client;
