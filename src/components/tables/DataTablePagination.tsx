// Borrowed from https://ui.shadcn.com/docs/components/data-table#pagination-1

import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useHotkeys } from "react-hotkeys-hook";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  type: "players" | "clubs";
}

export const DataTablePagination = <TData,>({
  table,
  type,
}: DataTablePaginationProps<TData>) => {
  useHotkeys(
    "ArrowLeft",
    () => {
      if (table.getCanPreviousPage()) table.previousPage();
    },
    { enableOnFormTags: false },
  );

  useHotkeys(
    "ArrowRight",
    () => {
      if (table.getCanNextPage()) table.nextPage();
    },
    { enableOnFormTags: false },
  );

  const skeletonCount = type === "players" ? 10_000 : 5_000;
  const totalRows = table.getCoreRowModel().rows.length || skeletonCount;

  return (
    <div className="flex flex-wrap items-center justify-between gap-1">
      <div className="text-sm text-neutral-500">
        {table.getFilteredRowModel().rows.length <
        table.getCoreRowModel().rows.length ? (
          <>
            <span className="font-medium text-foreground">
              {table.getFilteredRowModel().rows.length.toLocaleString("en")}
            </span>
            {" of "}
            {totalRows.toLocaleString("en")} {type}
          </>
        ) : (
          <>
            {totalRows.toLocaleString("en")} {type}
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            localStorage.setItem("tfl-table-page-size", value);
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top" className="font-saira">
            {[5, 10, 20, 30, 40, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getCoreRowModel().rows.length
            ? table.getPageCount()
            : Math.ceil(skeletonCount / table.getState().pagination.pageSize)}
        </div>

        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title="Go to first page"
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title="Go to previous page"
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title="Go to next page"
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          title="Go to last page"
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  );
};
