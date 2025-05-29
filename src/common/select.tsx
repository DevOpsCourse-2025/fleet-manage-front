import * as React from "react";

import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        className={cn(
          "form-select !border-input block h-10 w-full rounded-sm border bg-background px-3 py-2 text-base ring-offset-background disabled:cursor-not-allowed sm:text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Select.displayName = "Select";

export { Select };
