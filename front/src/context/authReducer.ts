import * as Auth from "../types/auth";

const AuthReducer = (state: Auth.authState, action: Auth.authAction) => {
  switch (action.type) {
    case "LOGIN_START": // Si es un inicio de login entonces
      return {
        // Mandame
        ...state, // Todo los estados incluyendo los anteriores
        loading: true, // Prendemos el "Cargando..." y
        error: null, // Limpiamos el error
      };
    case "LOGIN_SUCCESS": // Si el login es exitoso
      return {
        // Mandame
        ...state, // Los datos
        loading: false, // Apagame el cargando
        error: null, // No hay error
        user: action.payload.user, // Quiero que el usuario, tenga los datos del payload (datos cargados)
        token: action.payload.token, // Quiero que el token, tenga el token del payload (token cargado)
      };
    case "LOGIN_ERROR": // Si el login fallo
      return {
        // Mandame
        ...state, // Los datos
        loading: false, // Apagame el cargando
        error: action.payload, // Mandame el error
      };
    case "LOGOUT": // Si el logout es exitoso
      return Auth.AUTH_INICIAL; // vuelve al estado inicial
    default:
      return state;
  }
};

export default AuthReducer;
