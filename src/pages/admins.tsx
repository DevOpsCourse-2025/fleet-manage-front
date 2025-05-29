import {  
  InfinityTable,  
  SimpleReactTableBody,  
  SimpleReactTableHeader,  
  TablePaginationFooter,  
} from "@/common/infinity-table";  
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";  
import { Button } from "@/components/ui/button";  
import {  
  Dialog,  
  DialogClose,  
  DialogContent,  
  DialogDescription,  
  DialogFooter,  
  DialogHeader,  
  DialogTitle,  
} from "@/components/ui/dialog";  
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";  
import { TableCell, TableHead } from "@/components/ui/table";  
import { useNotification } from "@refinedev/core";  
import {  
  createColumnHelper,  
  flexRender,  
  getCoreRowModel,  
  useReactTable,  
} from "@tanstack/react-table";  
import { useState, useEffect } from "react";  
import { adminService } from "@/services/adminService";  
import { AdminPublic } from "@/lib/types/admin";

export function AdminsPage() {
  const { open } = useNotification();
  const [admins, setAdmins] = useState<AdminPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<AdminPublic | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const columnHelper = createColumnHelper<AdminPublic>();

  const columns = [
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("invitationCode", {
      header: "Invitation Code",
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const admin = row.original;
        return (
          <RowActionsRoot>
            <RowActionsMenuItem onClick={() => handleEdit(admin)}>
              Edit
            </RowActionsMenuItem>
            <RowActionsMenuItem onClick={() => handleDelete(admin.email)}>
              Delete
            </RowActionsMenuItem>
          </RowActionsRoot>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: admins,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const data = await adminService.getAll();
      setAdmins(data);
    } catch (error) {
      open?.({
        type: "error",
        message: "Error loading administrators",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: AdminPublic) => {
    setEditingAdmin(admin);
    setEditModalVisible(true);
  };

  const handleUpdate = async (
    newEmail: string,
    newInvitationCode: string,
    newPassword: string
  ) => {
    if (!editingAdmin) return;

    setUpdating(true);
    try {
      const updatedAdmin = await adminService.update({
        email: newEmail,
        invitationCode: newInvitationCode,
        password: newPassword,
      });

      setAdmins(prev =>
        prev.map(admin =>
          admin.email === editingAdmin.email ? updatedAdmin : admin
        )
      );

      setEditModalVisible(false);
      setEditingAdmin(null);

      open?.({
        type: "success",
        message: "Administrator updated successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error updating administrator",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (email: string) => {
    try {
      await adminService.deleteByEmail(email);
      setAdmins(prev => prev.filter(admin => admin.email !== email));
      open?.({
        type: "success",
        message: "Administrator deleted successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error deleting administrator",
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
          Administrators
        </h3>
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
                      header.getContext()
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

      {/* Modal de Edición */}
      <Dialog open={editModalVisible} onOpenChange={setEditModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>
              Update the administrator's information.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newEmail = formData.get("email") as string;
              const newInvitationCode = formData.get("invitationCode") as string;
              const newPassword = formData.get("password") as string;
              handleUpdate(newEmail, newInvitationCode, newPassword);
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingAdmin?.email}
                  required
                />
              </div>
              <div>
                <Label htmlFor="invitationCode">Invitation Code</Label>
                <Input
                  id="invitationCode"
                  name="invitationCode"
                  type="text"
                  defaultValue={editingAdmin?.invitationCode}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}