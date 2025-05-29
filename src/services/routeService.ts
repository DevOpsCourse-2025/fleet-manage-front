import { fetchApi } from "@/lib/utils";   
import { RoutePublic, Route } from "@/lib/types/route";
  
export const routeService = {  
  getAll: () =>  
    fetchApi<RoutePublic[]>(`${import.meta.env.VITE_API_ORIGIN}/route/getall`),  
  
  getByVin: (vin: string) =>  
    fetchApi<RoutePublic>(`${import.meta.env.VITE_API_ORIGIN}/route/get/${vin}`),  
  
  create: (route: Route) =>  
    fetchApi<RoutePublic>(`${import.meta.env.VITE_API_ORIGIN}/route/create`, {  
      method: "POST",  
      body: JSON.stringify(route),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  update: (route: RoutePublic) =>  
    fetchApi<RoutePublic>(`${import.meta.env.VITE_API_ORIGIN}/route/update`, {  
      method: "PUT",  
      body: JSON.stringify(route),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  delete: (vin: string) =>  
    fetchApi<RoutePublic>(`${import.meta.env.VITE_API_ORIGIN}/route/delete/${vin}`, {  
      method: "DELETE",  
    }),  
};