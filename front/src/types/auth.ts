// Para el loginPage
export interface User {
  id: number;
  email: string;
  rol?: "admin" | "cliente" | "barbero";
  nombre?: string;
}

//Para el LoginPage
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

// Para el Reduce
export interface authState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Para el Reduce (Pero es un tipo de contrato de estado)
export type authAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" };

// Este es el estado inicial del authAction
export const AUTH_INICIAL: authState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Esto representa lo que viene adentro del token decodificado
export interface CustomJwtPayload {
  user_id: number;
  nombre: string;
  rol: "admin" | "barbero" | "cliente"; // Esto debe coincidir con el rol de la base de datos si o si.
  exp: number;
  iat: number;
  jti: string;
} // Es necesario para poder decodificar el token en el front, en desarrollo no rompe pero en produccion si.
