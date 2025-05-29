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
import { vehicleAssignmentService } from "@/services/assignmentService";  
import { VehicleAssignmentPublic } from "@/lib/types/assignment";  

export function AssignmentsPage() {  
  const { open } = useNotification();  
  const [assignments, setAssignments] = useState<VehicleAssignmentPublic[]>([]);  
  const [loading, setLoading] = useState(true);  
  
  const columnHelper = createColumnHelper<VehicleAssignmentPublic>();  
  
  const columns = [  
    columnHelper.accessor("vin", {  
      header: "Vehicle VIN",  
    }),  
    columnHelper.accessor("driverCurp", {  
      header: "Driver CURP",  
    }),  
    columnHelper.accessor("status", {  
      header: "Status",  
    }),  
    columnHelper.accessor("assignedAt", {  
      header: "Assigned At",  
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),  
    }),    
    columnHelper.display({  
      id: "actions",  
      header: () => <span className="sr-only">Actions</span>,  
      cell: ({ row }) => {  
        const assignment = row.original;  
        return (  
          <RowActionsRoot>  
            <RowActionsMenuItem  
              onClick={() => handleEdit(assignment.vin, assignment.driverCurp)}  
            >  
              Edit  
            </RowActionsMenuItem>  
            <RowActionsMenuItem  
              onClick={() => handleDelete(assignment.vin, assignment.driverCurp)}  
            >  
              Delete  
            </RowActionsMenuItem>  
          </RowActionsRoot>  
        );  
      },  
    }),  
  ];  
  
  const table = useReactTable({  
    data: assignments,  
    columns,  
    getCoreRowModel: getCoreRowModel(),  
  });  
  
  useEffect(() => {  
    loadAssignments();  
  }, []);  
  
  const loadAssignments = async () => {  
    try {  
      const data = await vehicleAssignmentService.getAll();  
      setAssignments(data);  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error loading assignments",  
      });  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleEdit = (vin: string, driverCurp: string) => {  
    window.location.href = `/assignments/${vin}/edit`;  
  };  
  
  const handleDelete = async (vin: string, driverCurp: string) => {  
    try {  
      await vehicleAssignmentService.delete(`${vin}-${driverCurp}`);  
      setAssignments(prev =>   
        prev.filter(assignment =>   
          !(assignment.vin === vin && assignment.driverCurp === driverCurp)  
        )  
      );  
      open?.({  
        type: "success",  
        message: "Assignment deleted successfully",  
      });  
    } catch (error) {  
      open?.({  
        type: "error",  
        message: "Error deleting assignment",  
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
          Assignments  
        </h3>  
        <Button className="font-normal" size="sm" asChild>  
          <Link to="new">  
            <CirclePlus className="mr-2 h-4 w-4" /> Add Assignment  
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