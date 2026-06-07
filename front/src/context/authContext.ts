// Este archivos es para que la pagina sepa quien es el usuario que esta usando la pagina a nivel general.
import { createContext } from "react";
import * as Auth from "../types/auth";

// Creamos el contexto. Y exportamos el contexto para que el hook lo pueda ver
export const AuthContext = createContext<Auth.AuthContextType | null>(null); // Aca va AuthContextType que es el que definimos en el contrato para los tipos de acciones que queremos hacer.

// Este es el archivo que se debe llamar en el hooks, luego en cualquier componente que necesitemos las autenticaciones debemos llamar al hooks osea useAuth, porque el hooks es el gancho con el contexto.
