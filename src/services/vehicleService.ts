import { fetchApi } from "@/lib/utils";  
  
import { VehiclePublic, Vehicle  } from "@/lib/types/vehicle";
  
export const vehicleService = {  
  getAll: () =>  
    fetchApi<VehiclePublic[]>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/getall`),  
  
  getByVin: (vin: string) =>  
    fetchApi<VehiclePublic>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/get/${vin}`),  
  
  getByModel: (model: string) =>  
    fetchApi<VehiclePublic[]>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/model/${model}`),  
  
  create: (vehicleData: Vehicle, imageFile: File) => {  
    const formData = new FormData();  

    const vehicleBlob = new Blob([JSON.stringify(vehicleData)], {  
      type: 'application/json'  
    });
      
    formData.append('vehicle', vehicleBlob);  
      
    if (imageFile) {  
      formData.append('imageFile', imageFile);  
    }  
      
    return fetchApi<Vehicle>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/create`, {  
      method: "POST",  
      body: formData,  
    });  
  },  
  
  update: (vehicle: VehiclePublic) => {
    fetchApi<VehiclePublic>(`${import.meta.env.VITE_API_ORIGIN}/vehicle/update`, {  
      method: "PUT",  
      body: JSON.stringify(vehicle),  
      headers: { "Content-Type": "application/json" },  
    })  
    return { success: true };
  },
  
  deleteByVin: async (vin: string) => {   
      fetchApi(`${import.meta.env.VITE_API_ORIGIN}/vehicle/delete/${vin}`, {  
        method: "DELETE",  
      });  
      return { success: true };   
  },
  
  getImageUrl: (filename: string) =>  
    `${import.meta.env.VITE_API_ORIGIN}/vehicle/view/${filename}`,  
};