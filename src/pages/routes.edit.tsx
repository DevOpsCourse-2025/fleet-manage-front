import { FormCardFooter } from "@/common/form-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleAssignmentPublic } from "@/lib/types/assignment";
import type { RoutePublic, Route } from "@/lib/types/route";
import { cn, handleFormError } from "@/lib/utils";
import { type HttpError, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { format } from "date-fns";
import { Controller } from "react-hook-form";
import { Select } from "@/common/select";


export function RoutesEditPage() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { options: assignmentOptions } = useSelect<VehicleAssignmentPublic>({
    resource: "assignments",
    optionLabel: (item) => `${item.driverCurp} - ${item.vin}`,
    optionValue: "vin",
  });

  const {
    refineCore: { onFinish },
    formState: { isSubmitting },
    register,
    control,
    handleSubmit,
  } = useForm<RoutePublic, HttpError, Route>({
    refineCoreProps: {
      errorNotification: (error, _, resource) => {
        if (!error) throw new Error("An error occurred");
        return handleFormError(error, resource);
      },
    },
    shouldUseNativeValidation: true,
  });

  async function handleFinish(data: Route) {
    const trimmedComment = data.comment?.trim();
    data.comment = trimmedComment ? trimmedComment : "Sin comentario";

    if ((data as any).success !== false) {
      (data as any).problemDescription = null;
    }

    await onFinish(data);
  }

  return (
    <Card className="-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x">
      <CardHeader>
        <CardTitle>Route details</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="edit"
          className="gap grid gap-y-5"
          onSubmit={handleSubmit(handleFinish)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input {...register("name")} id="name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="routeName">Route Name</Label>
            <Input {...register("routeName", { required: true })} id="routeName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleVin">Vehicle VIN</Label>
            <Controller
              control={control}
              name="vehicleVin"
              rules={{ required: true }}
              render={({ field }) => (
                <Select id="vehicleVin" {...field}>
                  <option value="">Selecciona un vehículo</option>
                  {assignmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endLatitude">End latitude</Label>
            <Input
              {...register("endLatitude", { required: true })}
              id="endLatitude"
              type="number"
              step="0.0000001"
              min="-90"
              max="90"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endLongitude">End longitude</Label>
            <Input
              {...register("endLongitude", { required: true })}
              id="endLongitude"
              type="number"
              step="0.0000001"
              min="-180"
              max="180"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelDate">Travel date</Label>
            <Input
              {...register("travelDate", {
                required: true,
              })}
              id="travelDate"
              type="date"
              min={today}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">
              Comment{" "}
              <span className="font-normal text-muted-foreground text-xs">
                (optional)
              </span>
            </Label>
            <Input {...register("comment")} id="comment" />
          </div>
        </form>
      </CardContent>
      <FormCardFooter
        cancelHref="/routes"
        saveForm="edit"
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
