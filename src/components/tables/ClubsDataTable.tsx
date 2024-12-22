import { Fragment, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./DataTablePagination";
import { useHotkeys } from "react-hotkeys-hook";
import Loading from "../Loading";
import ClubsDataTableToolbar from "./ClubsDataTableToolbar";
import { useSearch } from "@tanstack/react-router";

interface DataTableProps<TData, TValue> {
  queryState: {
    isLoading: boolean;
    isRefetching: boolean;
  };
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ClubsDataTable<TData, TValue>({
  queryState,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { clubTag } = useSearch({
    from: "/",
    select: ({ clubTag }) => ({ clubTag }),
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "rank",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "clubTag", value: clubTag ?? "" },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const ref = useHotkeys<HTMLTableElement>(["ArrowLeft", "ArrowRight"], (e) => {
    if (e.key === "ArrowLeft" && table.getCanPreviousPage()) {
      table.previousPage();
    }

    if (e.key === "ArrowRight" && table.getCanNextPage()) {
      table.nextPage();
    }
  });

  return (
    <div className="space-y-3">
      <ClubsDataTableToolbar table={table} />

      <div className="rounded-md border">
        <Table className="min-w-[800px] outline-none" tabIndex={-1} ref={ref}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-inherit">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {queryState.isLoading ? (
                    <Loading justifyCenter />
                  ) : (
                    "No results."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
