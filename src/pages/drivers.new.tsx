import { FormCardFooter } from "@/common/form-card";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import { driverService } from "@/services/driverService";  
import { Driver } from "@/lib/types/driver"; 

export function DriversNewPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    setIsSubmitting(true);  
  
    try {  
      const formData = new FormData(e.currentTarget);  
        
      const driverData: Driver = {  
        firstName: formData.get('firstName') as string,  
        lastName: formData.get('lastName') as string,  
        curp: formData.get('curp') as string,  
        street: formData.get('street') as string,  
        city: formData.get('city') as string,  
        state: formData.get('state') as string,  
        monthlySalary: Number(formData.get('monthlySalary')),  
        licenseNumber: formData.get('licenseNumber') as string,  
        registrationDate: new Date().toISOString()
      };  
  
      await driverService.create(driverData);  
        
      open?.({  
        type: "success",  
        message: "Driver created successfully",  
      });  
        
      navigate("/drivers");  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error creating driver",  
      });  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Add a new driver</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="create"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="firstName">First Name</Label>  
            <Input id="firstName" name="firstName" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="lastName">Last Name</Label>  
            <Input id="lastName" name="lastName" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="curp">CURP</Label>  
            <Input id="curp" name="curp" required />  
            <p className="text-muted-foreground text-sm">Must be unique.</p>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="street">Street</Label>  
            <Input id="street" name="street" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="city">City</Label>  
            <Input id="city" name="city" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="state">State</Label>  
            <Input id="state" name="state" required />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="monthlySalary">Monthly Salary</Label>  
            <Input  
              id="monthlySalary"  
              name="monthlySalary"  
              type="number"  
              step="0.01"  
              min={0}  
              required  
            />  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="licenseNumber">License Number</Label>  
            <Input  
              id="licenseNumber"  
              name="licenseNumber"  
              required  
            />  
            <p className="text-muted-foreground text-sm">Must be unique.</p>  
          </div>  
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/drivers"  
        saveForm="create"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}