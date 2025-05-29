import { FormCardFooter } from "@/common/form-card";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import { routeService } from "@/services/routeService"; 
import { Route } from "@/lib/types/route"; 
import { vehicleService } from "@/services/vehicleService"; 
import { VehiclePublic } from "@/lib/types/vehicle";
  
export function RoutesNewPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [vehicles, setVehicles] = useState<VehiclePublic[]>([]);  
  const [loadingVehicles, setLoadingVehicles] = useState(true);  
  
  useEffect(() => {  
    loadVehicles();  
  }, []);  
  
  const loadVehicles = async () => {  
    try {  
      const data = await vehicleService.getAll();  
      setVehicles(data);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading vehicles",  
      });  
    } finally {  
      setLoadingVehicles(false);  
    }  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    setIsSubmitting(true);  
  
    try {  
      const formData = new FormData(e.currentTarget);  
  
      const routeData: Route = {  
        routeName: formData.get('routeName') as string,  
        vehicleVin: formData.get('vehicleVin') as string,  
        travelDate: `${formData.get('travelDate')}T00:00:00`,  
        startLatitude: Number(formData.get('startLatitude')),  
        startLongitude: Number(formData.get('startLongitude')),  
        endLatitude: Number(formData.get('endLatitude')),  
        endLongitude: Number(formData.get('endLongitude')), 
        creationDate: new Date().toISOString(), 
        name: formData.get('name') as string || "N/A",  
        description: formData.get('description') as string || "N/A",  
        comment: formData.get('comment') as string || "N/A",  
      };  
  
      await routeService.create(routeData);  
  
      open?.({  
        type: "success",  
        message: "Route created successfully",  
      });  
  
      navigate("/routes");  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error creating route",  
      });  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  
  
  if (loadingVehicles) {  
    return <div>Loading vehicles...</div>;  
  }  
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Add a new route</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="create"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="routeName">Route Name</Label>  
            <Input id="routeName" name="routeName" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="vehicleVin">Vehicle VIN</Label> <br /> 
            <select id="vehicleVin" name="vehicleVin" defaultValue="" required>  
              <option value="" disabled>Select a vehicle</option>  
              {vehicles.map((vehicle) => (  
                <option key={vehicle.vin} value={vehicle.vin}>  
                  {vehicle.vin} - {vehicle.brand} {vehicle.model}  
                </option>  
              ))}  
            </select>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="travelDate">Travel Date</Label>  
            <Input id="travelDate" name="travelDate" type="date" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="startLatitude">Start Latitude</Label>  
            <Input id="startLatitude" name="startLatitude" type="number" step="0.0000001" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="startLongitude">Start Longitude</Label>  
            <Input id="startLongitude" name="startLongitude" type="number" step="0.0000001" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="endLatitude">End Latitude</Label>  
            <Input id="endLatitude" name="endLatitude" type="number" step="0.0000001" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="endLongitude">End Longitude</Label>  
            <Input id="endLongitude" name="endLongitude" type="number" step="0.0000001" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="name">Name (Optional)</Label>  
            <Input id="name" name="name" />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="description">Description (Optional)</Label>  
            <Input id="description" name="description" />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="comment">Comment (Optional)</Label>  
            <Input id="comment" name="comment" />  
          </div>  
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/routes"  
        saveForm="create"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}