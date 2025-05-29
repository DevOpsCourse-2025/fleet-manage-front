import { FormCardFooter } from "@/common/form-card";  
import { Select } from "@/common/select";  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";  
import { Label } from "@/components/ui/label";  
import { useNotification } from "@refinedev/core";  
import { useState, useEffect } from "react";  
import { useNavigate, useParams } from "react-router-dom";  
import { vehicleAssignmentService } from "@/services/assignmentService";  
import { driverService } from "@/services/driverService";  
import { vehicleService } from "@/services/vehicleService";  
import { VehicleAssignmentPublic } from "@/lib/types/assignment";
import { DriverPublic } from "@/lib/types/driver";
import { VehiclePublic } from "@/lib/types/vehicle";
  
export function AssignmentsEditPage() {  
  const { open } = useNotification();  
  const navigate = useNavigate();  
  const { vin } = useParams<{ vin: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const [loading, setLoading] = useState(true);  
  const [assignment, setAssignment] = useState<VehicleAssignmentPublic>();  
  const [drivers, setDrivers] = useState<DriverPublic[]>([]);  
  const [vehicles, setVehicles] = useState<VehiclePublic[]>([]);  
  
  useEffect(() => {  
    if (vin) {  
      loadAssignmentAndOptions();  
    }  
  }, [vin]);  
  
  const loadAssignmentAndOptions = async () => {  
    try {  
      const [assignmentData, driversData, vehiclesData] = await Promise.all([  
        vehicleAssignmentService.getByVin(vin!), 
        driverService.getAll(),  
        vehicleService.getAll()  
      ]);  
      setAssignment(assignmentData);  
      setDrivers(driversData);  
      setVehicles(vehiclesData);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading assignment data",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };    
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    if (!assignment) return;  
      
    setIsSubmitting(true);  
  
    try {  
      const formData = new FormData(e.currentTarget);  
        
      const assignmentData: VehicleAssignmentPublic = {  
        driverCurp: assignment.driverCurp,  
        vin: formData.get('vin') as string,  
        status: formData.get('status') as string,  
        assignedAt: new Date().toISOString(),  
        releasedAt: assignment.releasedAt,  
        changedDriverCurp: formData.get('driverCurp') as string,
      };  
  
      await vehicleAssignmentService.update(assignmentData);  
        
      open?.({  
        type: "success",  
        message: "Assignment updated successfully",  
      });  
        
      navigate("/assignments");  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error updating assignment",  
      });  
    } finally {  
      setIsSubmitting(false);  
    }  
  };  
  
  if (loading) {  
    return <div>Loading...</div>;  
  }  
  
  if (!assignment) {  
    return <div>Assignment not found</div>;  
  }  
  
  return (  
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">  
      <CardHeader>  
        <CardTitle>Assignment details</CardTitle>  
      </CardHeader>  
      <CardContent>  
        <form  
          id="edit"  
          className="gap grid gap-y-5"  
          onSubmit={handleSubmit}  
        >  
          <div className="space-y-2">  
            <Label htmlFor="vin">Vehicle VIN</Label>  
            <Select  
              id="vin"  
              name="vin"  
              defaultValue={assignment.vin}  
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
              defaultValue={assignment.driverCurp}  
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
          <div className="space-y-2">  
            <Label htmlFor="status">Status</Label>  
            <Select  
              id="status"  
              name="status"  
              defaultValue={assignment.status}  
              required  
            >  
              <option value="assigned">Assigned</option>  
              <option value="unassigned">Unassigned</option>  
            </Select>  
          </div>  
        </form>  
      </CardContent>  
      <FormCardFooter  
        cancelHref="/assignments"  
        saveForm="edit"  
        isSubmitting={isSubmitting}  
      />  
    </Card>  
  );  
}