import {
  InfinityTable,
  SimpleReactTableBody,
  SimpleReactTableHeader,
  TablePaginationFooter,
} from "@/common/infinity-table";
import { RowActionsMenuItem, RowActionsRoot } from "@/common/row-actions";
import { useClipboard } from "@/common/use-clipboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  invitationService,
  type InvitationCode,
} from "@/services/invitationService";

export function Invitations() {
  const { copy } = useClipboard();
  const { open } = useNotification();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [generating, setGenerating] = useState(false);

  const columnHelper = createColumnHelper<InvitationCode>();

  const columns = [
    columnHelper.accessor("code", {
      header: "Code",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const invitation = row.original;
        return (
          <RowActionsRoot>
            <RowActionsMenuItem
              onClick={() =>
                copy(invitation.code, {
                  id: `copy-invitation-${invitation.code}`,
                  message: "Invitation code copied to clipboard.",
                })
              }
            >
              Copy code
            </RowActionsMenuItem>
            <RowActionsMenuItem
              onClick={() => handleDelete(invitation.code)}
            >
              Delete
            </RowActionsMenuItem>
          </RowActionsRoot>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: codes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const data = await invitationService.getAll();
      setCodes(data || []);
    } catch (error) {
      open?.({
        type: "error",
        message: "Error loading invitation codes",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const newCode = await invitationService.generate();
      setCodes((prev) => [...prev, newCode]);
      setModalVisible(false);
      open?.({
        type: "success",
        message: "Invitation code generated successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error generating invitation code",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (codeId: string) => {
    try {
      await invitationService.deleteByCode(codeId);
      setCodes((prev) => prev.filter((code) => code.code !== codeId));
      open?.({
        type: "success",
        message: "Invitation code deleted successfully",
      });
    } catch (error) {
      open?.({
        type: "error",
        message: "Error deleting invitation code",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-end justify-between mb-4">
        <h3 className="font-semibold text-2xl leading-none tracking-tight">
          Invitations
        </h3>
        <Dialog open={modalVisible} onOpenChange={setModalVisible}>
          <DialogTrigger asChild>
            <Button className="font-normal" size="sm">
              <CirclePlus className="mr-2 h-4 w-4" /> Add Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to create an invitation?
              </DialogTitle>
              <DialogDescription>
                Anyone with the invitation code will be able to register an
                account. Invitations can be deleted at any time before they are
                used.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleGenerateCode}
                disabled={generating}
              >
                {generating ? "Generating..." : "Accept"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
    </>
  );
}
