import { FormCardFooter } from "@/common/form-card";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import { vehicleService } from "@/services/vehicleService";  
import { VehiclePublic } from "@/lib/types/vehicle";

export function VehiclesNewPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const vehicleData: VehiclePublic = {
        brand: formData.get("brand") as string,
        model: formData.get("model") as string,
        vin: formData.get("vin") as string,
        cost: Number(formData.get("cost")),
        plate: formData.get("plate") as string,
        purchaseDate: formData.get("purchaseDate") as string,
        registrationDate: new Date().toISOString().split('T')[0], 
      };

      const imageFile = formData.get("photo") as File;

      await vehicleService.create(vehicleData, imageFile);

      open?.({
        type: "success",
        message: "Vehicle created successfully",
      });

      navigate("/vehicles");
    } catch (error) {
      open?.({
        type: "error",
        message: "Error creating vehicle",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Add a new vehicle</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="create"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="brand">Brand</Label>  
            <Input id="brand" name="brand" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="model">Model</Label>  
            <Input id="model" name="model" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="vin">VIN</Label>  
            <Input id="vin" name="vin" required />  
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
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="plate">License plate</Label>  
            <Input id="plate" name="plate" required />  
            <p className="text-muted-foreground text-sm">Must be unique.</p>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="purchaseDate">Purchase date</Label>  
            <Input  
              id="purchaseDate"  
              name="purchaseDate"  
              type="date"  
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="photo">Photo</Label>  
            <Input  
              id="photo"  
              name="photo"  
              type="file"  
              accept="image/png, image/jpeg"  
              required  
            />  
          </div>  
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/vehicles"  
        saveForm="create"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}