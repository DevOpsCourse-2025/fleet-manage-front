import type { AuthProvider } from "@refinedev/core";  
import {  
  clearSessionFromLocalStorage,  
  fetchApi,  
  getSessionFromLocalStorage,  
  setSessionInLocalStorage,  
} from "./lib/utils";  
import { authService } from "./services/authService";  
  
export const authProvider = (apiUrl: string): AuthProvider => ({  
  register: async ({ email, password, invitationCode }) => {  
    const admin = await authService.register({ email, password, invitationCode });  
    return {  
      success: true,  
      redirectTo: "/login",  
      successNotification: {  
        message: "Registro exitoso. Ahora puedes iniciar sesión.",  
      },  
    };  
  },  
    
  login: async ({ email, password, invitationCode}) => {  
    const { session } = await authService.login({ email, password, invitationCode });  
    setSessionInLocalStorage(session.token);  
    return {  
      success: true,  
      redirectTo: "/",  
      successNotification: {  
        message: "Has iniciado sesión correctamente!",  
      },  
    };  
  },  
    
  logout: async () => {  
    clearSessionFromLocalStorage();  
    return {  
      success: true,  
      redirectTo: "/login",  
      successNotification: {  
        message: "Has cerrado sesión!",  
      },  
    };  
  },  
    
  check: async () => {  
    const token = getSessionFromLocalStorage();  
    if (token) {  
      return {  
        authenticated: true,  
      };  
    }  
  
    return {  
      authenticated: false,  
      redirectTo: "/login",  
    };  
  },  
    
  getPermissions: async () => null,  
    
  getIdentity: async () => {  
    const token = getSessionFromLocalStorage();  
    if (token) {  
      return {  
        id: 1,  
        name: "Administrator",  
        avatar: "https://i.pravatar.cc/300",  
      };  
    }  
    return null;  
  },  
    
  onError: async (error) => {  
    if (error.status === 401 || error.status === 403) {  
      return {  
        logout: true,  
        redirectTo: "/login",  
        error,  
      };  
    }  
    return {};  
  },  
});