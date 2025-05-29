import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

type FormCardFooterProps = {
  cancelHref: `/${string}`;
  isSubmitting: boolean;
  saveForm: string | undefined;
};

export function FormCardFooter({
  isSubmitting,
  cancelHref,
  saveForm,
}: FormCardFooterProps) {
  return (
    <CardFooter className="flex justify-end gap-3 border-t py-3">
      <Button type="button" size="sm" variant="link" asChild>
        <Link to={cancelHref}>Cancel</Link>
      </Button>
      <Button form={saveForm} type="submit" size="sm" disabled={isSubmitting}>
        Save
      </Button>
    </CardFooter>
  );
}
