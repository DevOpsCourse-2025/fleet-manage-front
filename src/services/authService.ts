import { fetchApi } from "@/lib/utils";  
import { AdminPublic } from "@/lib/types/admin";
  
export const authService = {  
  login: async (credentials: AdminPublic) => {  
    const response = await fetchApi<{ access_token: string }>(`${import.meta.env.VITE_API_ORIGIN}/auth/login`, {    
      method: "POST",    
      body: JSON.stringify(credentials),    
      headers: { "Content-Type": "application/json" },    
    });  
      
    return {  
      session: {  
        token: response.access_token  
      }  
    };  
  },  
  
  register: async (admin: AdminPublic) => {
    const response = await fetchApi<AdminPublic>(`${import.meta.env.VITE_API_ORIGIN}/auth/register`, {  
      method: "POST",  
      body: JSON.stringify(admin),  
      headers: { "Content-Type": "application/json" },  
    });

    return {succes: true};
  }
};