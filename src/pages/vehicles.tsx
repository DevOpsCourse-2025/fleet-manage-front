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
import { useState, useEffect } from "react";  
import { Link } from "react-router-dom";  
import { vehicleService } from "@/services/vehicleService";  
import { VehiclePublic } from "@/lib/types/vehicle";
  
export function VehiclesPage() {  
  const { open } = useNotification();  
  const [vehicles, setVehicles] = useState<VehiclePublic[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  const columnHelper = createColumnHelper<VehiclePublic>();  
  
  const columns = [  
    columnHelper.accessor("photoUrl", {  
      id: "photoUrl",  
      header: "Photo",  
      cell: ({ row }) => (  
        <img  
          alt="Vehicle photo"  
          className="aspect-square rounded-md object-cover"  
          src={row.original.photoUrl || "/placeholder-vehicle.jpg"}  
          loading="lazy"  
          decoding="async"  
          height={64}  
          width={64}  
        />  
      ),  
    }),  
    columnHelper.accessor("brand", {  
      header: "Brand",  
    }),  
    columnHelper.accessor("model", {  
      header: "Model",  
    }),  
    columnHelper.accessor("vin", {  
      header: "Vin",  
    }), 
    columnHelper.accessor("plate", {  
      header: "License Plate",  
    }),  
    columnHelper.accessor("cost", {  
      header: "Cost",  
      cell: (info) => `$${info.getValue().toLocaleString()}`,  
    }),  
    columnHelper.accessor("purchaseDate", {  
      header: "Purchase Date",  
      cell: (info) => info.getValue() ? new Date(info.getValue()).toISOString().split('T')[0] : "N/A",  
    }),
    columnHelper.accessor("registrationDate", {  
      header: "Registration Date",  
      cell: (info) => info.getValue() ? new Date(info.getValue()).toISOString().split('T')[0] : "N/A",  
    }),  
    columnHelper.display({  
      id: "actions",  
      header: () => <span className="sr-only">Actions</span>,  
      cell: ({ row }) => {  
        const vehicle = row.original;  
        return (  
          <RowActionsRoot>  
            <RowActionsMenuItem  
              onClick={() => handleEdit(vehicle.vin)}  
            >  
              Edit  
            </RowActionsMenuItem>  
            <RowActionsMenuItem  
              onClick={() => handleDelete(vehicle.vin)}  
            >  
              Delete  
            </RowActionsMenuItem>  
          </RowActionsRoot>  
        );  
      },  
    }),  
  ];  
  
  const table = useReactTable({  
    data: vehicles,  
    columns,  
    getCoreRowModel: getCoreRowModel(),  
  });  
  
  useEffect(() => {  
    loadVehicles();  
  }, []);  
  
  const loadVehicles = async () => {  
    try {  
      const data = await vehicleService.getAll();  
      setVehicles(data);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading vehicles",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleEdit = (vin: string) => {  
    window.location.href = `/vehicles/${vin}/edit`;  
  };  
  
  const handleDelete = async (vin: string) => {  
    try {  
      await vehicleService.deleteByVin(vin);  
      setVehicles(prev => prev.filter(vehicle => vehicle.vin !== vin));  
      open?.({  
        type: "success",  
        message: "Vehicle deleted successfully",  
      });  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error deleting vehicle",  
      });  
    }  
  };  
  
  if (loading) {  
    return <div>Loading...</div>;  
  }  
  
  return (  
    <>  
      <div className="flex items-end justify-between">  
        <h3 className="font-semibold text-2xl leading-none tracking-tight">  
          Vehicles  
        </h3>  
        <Button className="font-normal" size="sm" asChild>  
          <Link to="new">  
            <CirclePlus className="mr-2 h-4 w-4" /> Add Vehicle  
          </Link>  
        </Button>  
      </div>  
      <div className="flow-root">  
        <InfinityTable>  
          <SimpleReactTableHeader table={table}>  
            {(header) => (  
              <TableHead className="bg-muted/40 sm:first:w-[104px] first:min-w-[96px] sm:first:min-w-[104px] sm:last:pr-6 sm:first:pl-6">  
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