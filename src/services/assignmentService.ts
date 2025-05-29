import { fetchApi } from "@/lib/utils"; 

import { VehicleAssignmentPublic, VehicleAssignment } from "@/lib/types/assignment";

export const vehicleAssignmentService = {  
  getAll: () =>  
    fetchApi<VehicleAssignmentPublic[]>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/assignment/history`),  

  getByVin: (vin: string) =>  
    fetchApi<VehicleAssignmentPublic>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/assignment/vin/${vin}`),  
  
  create: (assignment: VehicleAssignment) =>  
    fetchApi<VehicleAssignmentPublic>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/assignment/assign`, {  
      method: "POST",  
      body: JSON.stringify(assignment),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  update: (assignment: VehicleAssignmentPublic) =>  
    fetchApi<VehicleAssignmentPublic>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/assignment/change`, {  
      method: "PUT",  
      body: JSON.stringify(assignment),  
      headers: { "Content-Type": "application/json" },  
    }),  
  
  delete: (id: string) =>  
    fetchApi(`${import.meta.env.VITE_API_ORIGIN}/vehicle/assignment/delete/${id}`, {  
      method: "DELETE",  
    }),  
};