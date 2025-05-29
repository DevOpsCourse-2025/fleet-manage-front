import {
  InfinityTable,
  SimpleReactTableBody,
  SimpleReactTableHeader,
  TablePaginationFooter,
} from "@/common/infinity-table";
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead } from "@/components/ui/table";
import { useNotification } from "@refinedev/core";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { driverService } from "@/services/driverService";
import { DriverPublic } from "@/lib/types/driver";

export function DriversPage() {
  const { open } = useNotification();
  const [drivers, setDrivers] = useState<DriverPublic[]>([]);
  const [loading, setLoading] = useState(true);

  const columnHelper = createColumnHelper<DriverPublic>();

  const columns = [
  columnHelper.display({
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const d = row.original;
      return <span>{`${d.firstName} ${d.lastName}`}</span>;
    },
  }),
  columnHelper.accessor("curp", {
    header: "CURP",
  }),
  columnHelper.accessor("licenseNumber", {
    header: "License Number",
  }),
  columnHelper.display({
    id: "address",
    header: "Address",
    cell: ({ row }) => {
      const d = row.original;
      return <span>{`${d.street}, ${d.city}, ${d.state}`}</span>;
    },
  }),
  columnHelper.accessor("monthlySalary", {
    header: "Monthly Salary",
    cell: (info) => {
      const value = info.getValue();
      if (value == null) return "N/D";

      const salary =
        typeof value === "number" ? value : parseFloat(String(value));

      return isNaN(salary) ? "N/D" : `$${salary.toFixed(2)}`;
    },
  }),
  columnHelper.accessor("registrationDate", {
    header: "Registration Date",
    cell: (info) => {
      const date = new Date(info.getValue());
      return !isNaN(date.getTime())
        ? date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Invalid Date";
    },
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => {
      const d = row.original;
      return (
        <RowActionsRoot>
          <RowActionsMenuItem onClick={() => handleEdit(d.curp)}>
            Edit
          </RowActionsMenuItem>
          <RowActionsMenuItem onClick={() => handleDelete(d.curp)}>
            Delete
          </RowActionsMenuItem>
        </RowActionsRoot>
      );
    },
  }),
];


  const table = useReactTable({
    data: drivers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (error) {
      open?.({
        type: "error",
        message: "Error loading drivers",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (curp: string) => {
    window.location.href = `/drivers/${curp}/edit`;
  };

  const handleDelete = async (curp: string) => {
    try {
      await driverService.deleteByCurp(curp);
      setDrivers((prev) => prev.filter((d) => d.curp !== curp));
      open?.({
        type: "success",
        message: "Driver deleted successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error deleting driver",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex items-end justify-between">
        <h3 className="font-semibold text-2xl leading-none tracking-tight">
          Drivers
        </h3>
        <Button className="font-normal" size="sm" asChild>
          <Link to="new">
            <CirclePlus className="mr-2 h-4 w-4" /> Add Driver
          </Link>
        </Button>
      </div>
      <div className="flow-root">
        <InfinityTable>
          <SimpleReactTableHeader table={table}>
            {(header) => (
              <TableHead className="bg-muted/40 sm:last:pr-6 sm:first:pl-6">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            )}
          </SimpleReactTableHeader>
          <SimpleReactTableBody table={table}>
            {(cell) => (
              <TableCell className="sm:last:pr-6 sm:first:pl-6">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )}
          </SimpleReactTableBody>
        </InfinityTable>
        <TablePaginationFooter table={table} />
      </div>
    </>
  );
}
