import { fetchApi } from "@/lib/utils";  

import { Driver, DriverPublic } from "@/lib/types/driver";
  
export const driverService = {  
  getAll: () =>  
    fetchApi<DriverPublic[]>(`${import.meta.env.VITE_API_ORIGIN}/driver/getall`),  
  
  getByCurp: (curp: string) =>  
    fetchApi<DriverPublic>(`${import.meta.env.VITE_API_ORIGIN}/driver/get/${curp}`),  
  
  create: (driver: Driver) =>  
    fetchApi<DriverPublic>(`${import.meta.env.VITE_API_ORIGIN}/driver/create`, {  
      method: "POST",  
      body: JSON.stringify(driver),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  update: (driver: DriverPublic) =>  
    fetchApi<DriverPublic>(`${import.meta.env.VITE_API_ORIGIN}/driver/update`, {  
      method: "PUT",  
      body: JSON.stringify(driver),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  deleteByCurp: (curp: string) => { 
    fetchApi(`${import.meta.env.VITE_API_ORIGIN}/driver/delete/${curp}`, {  
      method: "DELETE",  
    });
    return { success: true }; 
  }
};