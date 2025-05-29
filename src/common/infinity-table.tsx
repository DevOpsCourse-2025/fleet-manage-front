import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHeader, TableRow } from "@/components/ui/table";
import type { Cell, Header, Table as TableType } from "@tanstack/react-table";
import React from "react";

export function InfinityTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <div className="rounded-none border-y bg-card text-card-foreground shadow-sm sm:rounded-lg sm:border-x">
        <Table>{children}</Table>
      </div>
    </div>
  );
}

type SimpleReactTableHeaderProps<TData> = {
  table: TableType<TData>;
  children: (header: Header<TData, unknown>) => React.ReactNode;
};

export function SimpleReactTableHeader<TData>({
  table: { getHeaderGroups },
  children,
}: SimpleReactTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <React.Fragment key={header.id}>{children(header)}</React.Fragment>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

type SimpleReactTableBodyProps<TData> = {
  table: TableType<TData>;
  children: (cell: Cell<TData, unknown>) => React.ReactNode;
};

export function SimpleReactTableBody<TData>({
  table: { getRowModel },
  children,
}: SimpleReactTableBodyProps<TData>) {
  return (
    <TableBody>
      {getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <React.Fragment key={cell.id}>{children(cell)}</React.Fragment>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

type DataTablePaginationProps<TData> = {
  table: TableType<TData>;
};

export function TablePaginationFooter<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-end space-x-3 py-3">
      <Button
        variant="outline"
        size="sm"
        onClick={table.previousPage}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={table.nextPage}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  );
}
