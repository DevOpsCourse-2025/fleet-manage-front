import { fetchApi } from "@/lib/utils";  
import { AdminCredentials, AdminPublic } from "@/lib/types/admin";
  
export const adminService = {  
  login: (credentials: AdminCredentials) =>  
    fetchApi<{ session: any }>(`${import.meta.env.VITE_API_ORIGIN}/admin/login`, {  
      method: "POST",  
      body: JSON.stringify(credentials),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  register: (admin: AdminCredentials) =>  
    fetchApi<AdminPublic>(`${import.meta.env.VITE_API_ORIGIN}/admin/register`, {  
      method: "POST",  
      body: JSON.stringify(admin),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  getAll: () =>  
    fetchApi<AdminPublic[]>(`${import.meta.env.VITE_API_ORIGIN}/admin/getall`),  
  
  getByEmail: (email: string) =>  
    fetchApi<AdminPublic>(`${import.meta.env.VITE_API_ORIGIN}/admin/get/${email}`, {  
      method: "POST",  
    }),  
  
  update: (data: {email: string; invitationCode: string; password: string }) =>  
    fetchApi<AdminPublic>(`${import.meta.env.VITE_API_ORIGIN}/admin/update`, {  
      method: "PUT",  
      body: JSON.stringify(data),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  deleteByEmail: (email: string) => { 
    fetchApi(`${import.meta.env.VITE_API_ORIGIN}/admin/delete/${email}`, {  
      method: "DELETE",  
    });

    return {success: true};
  }
};