import { fetchApi } from "@/lib/utils";  
  
export interface InvitationCode {  
  code: string;  
  status: boolean;  
}  
  
export const invitationService = {  
  generate: () =>  
    fetchApi<InvitationCode>(`${import.meta.env.VITE_API_ORIGIN}/code/generate`),  
  
  getByCode: (code: string) =>  
    fetchApi<InvitationCode>(`${import.meta.env.VITE_API_ORIGIN}/code/get/${code}`),  

  getAll: () =>  
    fetchApi<InvitationCode[]>(`${import.meta.env.VITE_API_ORIGIN}/code/getall`), 
  
  deleteByCode: (code: string) =>  
    fetchApi(`${import.meta.env.VITE_API_ORIGIN}/code/delete/${code}`, {  
      method: "DELETE",  
    }),  
  
  markAsUsed: (code: string) =>  
    fetchApi<InvitationCode>(`${import.meta.env.VITE_API_ORIGIN}/code/use/${code}`, {  
      method: "POST",  
    }),  
};