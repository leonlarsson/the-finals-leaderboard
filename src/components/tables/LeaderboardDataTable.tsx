import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Fragment, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import { DataTablePagination } from "./DataTablePagination";
import { LeaderboardDataTableToolbar } from "./LeaderboardDataTableToolbar";

/** Lists up to this many rows fit on the default page, so they don't need pagination */
export const SHORT_LIST_ROWS = 10;

interface LeaderboatdDataTableProps<TData, TValue> {
  leaderboardId: LeaderboardId;
  queryState: {
    isLoading: boolean;
    isRefetching: boolean;
  };
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialNameFilter?: string;
  initialLeagues?: string[];
  /** The toolbar syncs filters with the main page's URL, so hide it on other routes. */
  showToolbar?: boolean;
  /** Hide the pagination when all rows fit on one page, e.g. for short lists */
  hidePaginationIfSinglePage?: boolean;
  /** localStorage key for the page size, so other pages don't share the main leaderboard's setting */
  pageSizeStorageKey?: string;
  /** What the pagination calls the rows, e.g. "members" on the club page */
  paginationType?: "players" | "members";
}

export function LeaderboardDataTable<TData, TValue>({
  leaderboardId,
  queryState,
  columns,
  data,
  initialNameFilter,
  initialLeagues,
  showToolbar = true,
  hidePaginationIfSinglePage = false,
  pageSizeStorageKey = "tfl-table-page-size",
  paginationType = "players",
}: LeaderboatdDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "rank",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "name", value: initialNameFilter ?? "" },
    ...(leaderboards[leaderboardId].features.includes("leagueFilter")
      ? [{ id: "fame", value: initialLeagues ?? [] }]
      : []),
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
    initialState: {
      pagination: {
        pageSize: Math.min(
          Number(localStorage.getItem(pageSizeStorageKey)) || 10,
          100,
        ),
      },
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

  // Pagination falls back to a 10K row count while loading, so hide it when there's no data at all.
  // Short lists can opt out of it entirely while loading and when everything fits on one page.
  // Longer lists always keep it, otherwise picking a big page size would hide the page size selector
  const showPagination = hidePaginationIfSinglePage
    ? !queryState.isLoading &&
      (table.getPageCount() > 1 || data.length > SHORT_LIST_ROWS)
    : queryState.isLoading || data.length > 0;

  return (
    <div className="space-y-3">
      {showToolbar && (
        <LeaderboardDataTableToolbar
          leaderboardId={leaderboardId}
          table={table}
        />
      )}

      <div className="space-y-2">
        {showPagination && (
          <DataTablePagination
            table={table}
            type={paginationType}
            pageSizeStorageKey={pageSizeStorageKey}
          />
        )}

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
              {queryState.isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <TableCell key={j} className="p-3">
                        <div
                          className={`h-5 rounded bg-neutral-200 dark:bg-neutral-700 ${
                            j === 0
                              ? "w-8"
                              : j === 1
                                ? "w-10"
                                : j === 2
                                  ? "w-36"
                                  : "w-16"
                          }`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {showPagination && (
          <DataTablePagination
            table={table}
            type={paginationType}
            pageSizeStorageKey={pageSizeStorageKey}
          />
        )}
      </div>
    </div>
  );
}
