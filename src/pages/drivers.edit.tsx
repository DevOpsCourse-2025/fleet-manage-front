import { FormCardFooter } from "@/common/form-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNotification } from "@refinedev/core";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { driverService } from "@/services/driverService";
import { Driver } from "@/lib/types/driver";

export function DriversEditPage() {
  const { open } = useNotification();
  const navigate = useNavigate();
  const { curp } = useParams<{ curp: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [driver, setDriver] = useState<Driver | null>(null);

  useEffect(() => {
    async function fetchDriver() {
      try {
        if (!curp) return;
        const data = await driverService.getByCurp(curp);
        setDriver(data);
      } catch (error) {
        open?.({
          type: "error",
          message: "Error loading driver data",
        });
      }
    }
    fetchDriver();
  }, [curp, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      const updatedDriver: Driver = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        curp: formData.get("curp") as string, // debe estar para actualizar
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        monthlySalary: Number(formData.get("monthlySalary")),
        licenseNumber: formData.get("licenseNumber") as string,
        registrationDate: driver?.registrationDate ?? new Date().toISOString(),
      };

      await driverService.update(updatedDriver);

      open?.({
        type: "success",
        message: "Driver updated successfully",
      });

      navigate("/drivers");
    } catch (error) {
      open?.({
        type: "error",
        message: "Error updating driver",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!driver) {
    return <div>Loading driver data...</div>;
  }

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Edit driver details</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="edit" className="gap grid gap-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={driver.firstName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={driver.lastName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="curp">CURP</Label>
            <Input
              id="curp"
              name="curp"
              defaultValue={driver.curp}
              required
              readOnly // generalmente no permites cambiar el CURP en edición
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input
              id="street"
              name="street"
              defaultValue={driver.street}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              defaultValue={driver.city}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              defaultValue={driver.state}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlySalary">Monthly Salary</Label>
            <Input
              id="monthlySalary"
              name="monthlySalary"
              type="number"
              step="0.01"
              min={0}
              defaultValue={driver.monthlySalary}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              defaultValue={driver.licenseNumber}
              required
            />
            <p className="text-muted-foreground text-sm">Must be unique.</p>
          </div>
        </form>
      </CardContent>
      <FormCardFooter
        cancelHref="/drivers"
        saveForm="edit"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
