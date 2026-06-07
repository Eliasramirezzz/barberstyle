import client from "./client";
import type { InterfaceServices as Servicios } from "../types/InterfaceServices";

// Definimos el contrato de paginación que usa Django Rest Framework, sino typescript no lo deja pasar.
interface DjangoPaginado {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Servicios[]; // Acá adentro viaja el array si está paginado
}

const serviceAPI = {
  // Le aclaramos a Axios que la respuesta puede ser el array directo O la estructura paginada
  listar: () => client.get<Servicios[] | DjangoPaginado>("/servicios/"),
  /* La variable listar guardara los servicios y es el indice para que sea consultado
   *  cliente.get: es la conexion y get para obtener.
   * Servicios[]: Es el contrato, osea ts dice que es un arreglo de servicios y no pueden aver datos diferentes
   * /servicios/: es la ruta para obtener los servicios, esta ruta es la que definios en el end-point.
   * */
};

export default serviceAPI;
