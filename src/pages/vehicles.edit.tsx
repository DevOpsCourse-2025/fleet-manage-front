import { FormCardFooter } from "@/common/form-card";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState, useEffect } from "react";  
import { useNavigate, useParams } from "react-router-dom";  
import { vehicleService } from "@/services/vehicleService";  
import { VehiclePublic } from "@/lib/types/vehicle";

export function VehiclesEditPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const { id: vin } = useParams<{ id: string }>();  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [vehicle, setVehicle] = useState<VehiclePublic | null>(null);  
  
  useEffect(() => {  
    if (vin) {  
      loadVehicle(vin);  
    }  
  }, [vin]);  
  
  const loadVehicle = async (vehicleVin: string) => {  
    try {  
      const data = await vehicleService.getByVin(vehicleVin);  
      setVehicle(data);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading vehicle",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    if (!vehicle) return;  
      
    setIsSubmitting(true);  
  
    try {  
      const formData = new FormData(e.currentTarget);  
        
      const vehicleData: VehiclePublic = {  
        brand: formData.get('brand') as string,  
        model: formData.get('model') as string,  
        vin: vehicle.vin,
        cost: Number(formData.get('cost')),  
        plate: formData.get('licensePlate') as string,  
        purchaseDate: formData.get('purchaseDate') as string,  
        photoUrl: vehicle.photoUrl,  
        registrationDate: vehicle.registrationDate,
      };  
  
      await vehicleService.update(vehicleData);  
        
      open?.({  
        type: "success",  
        message: "Vehicle updated successfully",  
      });  
        
      navigate("/vehicles");  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error updating vehicle",  
      });  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  
  
  if (loading) {  
    return <div>Loading...</div>;  
  }  
  
  if (!vehicle) {  
    return <div>Vehicle not found</div>;  
  }  
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Vehicle details</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="edit"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="brand">Brand</Label>  
            <Input  
              id="brand"  
              name="brand"  
              defaultValue={vehicle.brand}  
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="model">Model</Label>  
            <Input  
              className="w-full"  
              id="model"  
              name="model"  
              defaultValue={vehicle.model}  
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="vin">VIN</Label>  
            <Input  
              id="vin"  
              name="vin"  
              defaultValue={vehicle.vin}  
              required  
              disabled
            />  
            <p className="text-muted-foreground text-sm">Must be unique.</p>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="cost">Cost</Label>  
            <Input  
              id="cost"  
              name="cost"  
              type="number"  
              min={0}  
              max={10000000}  
              step={1}  
              defaultValue={vehicle.cost}  
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="licensePlate">License plate</Label>  
            <Input  
              id="licensePlate"  
              name="licensePlate"  
              defaultValue={vehicle.plate}  
              required  
            />  
            <p className="text-muted-foreground text-sm">Must be unique.</p>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="purchaseDate">Purchase date</Label>  
            <Input  
              id="purchaseDate"  
              name="purchaseDate"  
              type="date"  
              defaultValue={vehicle.purchaseDate}  
              required  
            />  
          </div>  
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/vehicles"  
        saveForm="edit"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}