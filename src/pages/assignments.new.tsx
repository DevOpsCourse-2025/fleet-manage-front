import { FormCardFooter } from "@/common/form-card";  
import { Select } from "@/common/select";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState, useEffect } from "react";  
import { useNavigate } from "react-router-dom";  
import { vehicleAssignmentService } from "@/services/assignmentService";  
import { driverService } from "@/services/driverService";  
import { vehicleService } from "@/services/vehicleService";  
import { VehicleAssignment } from "@/lib/types/assignment";  
import { DriverPublic } from "@/lib/types/driver";
import { VehiclePublic } from "@/lib/types/vehicle";

export function AssignmentsNewPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [drivers, setDrivers] = useState<DriverPublic[]>([]);  
  const [vehicles, setVehicles] = useState<VehiclePublic[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    loadOptions();  
  }, []);  
  
  const loadOptions = async () => {  
    try {  
      const [driversData, vehiclesData] = await Promise.all([  
        driverService.getAll(),  
        vehicleService.getAll()  
      ]);  
      setDrivers(driversData);  
      setVehicles(vehiclesData);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading options",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    setIsSubmitting(true);  
  
    try {  
      const formData = new FormData(e.currentTarget);  
        
      const assignmentData: VehicleAssignment = {  
        driverCurp: formData.get('driverCurp') as string,  
        vin: formData.get('vin') as string,  
        status: "assigned",  
        assignedAt: new Date().toISOString(), 
        releasedAt: new Date().toISOString()
      };  
  
      await vehicleAssignmentService.create(assignmentData);  
        
      open?.({  
        type: "success",  
        message: "Assignment created successfully",  
      });  
        
      navigate("/assignments");  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error creating assignment",  
      });  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  
  
  if (loading) {  
    return <div>Loading...</div>;  
  }  
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Create assignment</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="create"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="vin">Vehicle VIN</Label>  
            <Select  
              id="vin"  
              name="vin"  
              defaultValue=""  
              required  
            >  
              <option value="" disabled>  
                Select a vehicle  
              </option>  
              {vehicles.map((vehicle) => (  
                <option key={vehicle.vin} value={vehicle.vin}>  
                  {vehicle.vin} - {vehicle.brand} {vehicle.model}  
                </option>  
              ))}  
            </Select>  
          </div>  
          <div className="space-y-2">  
            <Label htmlFor="driverCurp">Driver CURP</Label>  
            <Select  
              id="driverCurp"  
              name="driverCurp"  
              defaultValue=""  
              required  
            >  
              <option value="" disabled>  
                Select a driver  
              </option>  
              {drivers.map((driver) => (  
                <option key={driver.curp} value={driver.curp}>  
                  {driver.curp} - {driver.firstName} {driver.lastName}  
                </option>  
              ))}  
            </Select>  
          </div>   
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/assignments"  
        saveForm="create"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}