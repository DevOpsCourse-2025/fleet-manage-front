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
import { routeService } from "@/services/routeService";  
import { RoutePublic } from "@/lib/types/route";  

export function RoutesPage() {  
  const { open } = useNotification();  
  const [routes, setRoutes] = useState<RoutePublic[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  const columnHelper = createColumnHelper<RoutePublic>();  
  
  const columns = [  
    columnHelper.accessor("routeName", {  
      header: "Route Name",  
    }),  
    columnHelper.accessor("vehicleVin", {  
      header: "Vehicle VIN",  
    }),  
    columnHelper.accessor("travelDate", {  
      header: "Travel Date",  
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),  
    }),  
    columnHelper.accessor("creationDate", {  
      header: "Creation Date",  
      cell: (info) => new Date().toLocaleDateString(),  
    }),  
    columnHelper.display({  
      id: "startCoordinates",  
      header: "Start Coordinates",  
      cell: ({ row }) => {  
        const route = row.original;  
        return <span>{`${route.startLatitude}, ${route.startLongitude}`}</span>;  
      },  
    }),  
    columnHelper.display({  
      id: "endCoordinates",  
      header: "End Coordinates",  
      cell: ({ row }) => {  
        const route = row.original;  
        return <span>{`${route.endLatitude}, ${route.endLongitude}`}</span>;  
      },  
    }),  
    columnHelper.accessor("name", { 
      header: "Name", 
      cell: ({ row }) => {  
        const route = row.original;  
        return <span>{`${route.name}`}</span>;  
      } 
    }),  
    columnHelper.accessor("description", {  
      header: "Description",
      cell: ({ row }) => {  
        const route = row.original;  
        return <span>{`${route.description}`}</span>;  
      }   
    }),  
    columnHelper.accessor("comment", {  
      header: "Comment", 
      cell: ({ row }) => {  
        const route = row.original;  
        return <span>{`${route.comment}`}</span>;  
      }  
    }),  
    columnHelper.display({  
      id: "actions",  
      header: () => <span className="sr-only">Actions</span>,  
      cell: ({ row }) => {  
        const route = row.original;  
        return (  
          <RowActionsRoot>  
            <RowActionsMenuItem  
              onClick={() => handleEdit(route.vehicleVin)}  
            >  
              Edit  
            </RowActionsMenuItem>  
            <RowActionsMenuItem  
              onClick={() => handleDelete(route.vehicleVin)}  
            >  
              Delete  
            </RowActionsMenuItem>  
          </RowActionsRoot>  
        );  
      },  
    }),  
  ];  
  
  const table = useReactTable({  
    data: routes,  
    columns,  
    getCoreRowModel: getCoreRowModel(),  
  });  
  
  useEffect(() => {  
    loadRoutes();  
  }, []);  
  
  const loadRoutes = async () => {  
    try {  
      const data = await routeService.getAll();  
      setRoutes(data);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading routes",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleEdit = (vin: string) => {  
    // Navegar a la página de edición usando VIN como identificador  
    window.location.href = `/routes/${vin}/edit`;  
  };  
  
  const handleDelete = async (vin: string) => {  
    try {  
      await routeService.delete(vin);  
      setRoutes(prev =>  
        prev.filter(route => route.vehicleVin !== vin)  
      );  
      open?.({  
        type: "success",  
        message: "Route deleted successfully",  
      });  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error deleting route",  
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
          Routes  
        </h3>  
        <Button className="font-normal" size="sm" asChild>  
          <Link to="new">  
            <CirclePlus className="mr-2 h-4 w-4" /> Add Route  
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