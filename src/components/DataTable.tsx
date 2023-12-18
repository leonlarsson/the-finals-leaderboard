import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
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
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import Icons from "@/components/icons";
import { DataTablePagination } from "./DataTablePagination";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";
import { Platforms } from "@/types";

interface DataTableProps<TData, TValue> {
  loading: boolean;
  selectedLeaderboardVersion: LEADERBOARD_VERSION;
  selectedPlatform: Platforms;
  setSelectedPlatform: (platform: Platforms) => void;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  loading,
  selectedLeaderboardVersion,
  selectedPlatform,
  setSelectedPlatform,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const searchParams = new URLSearchParams(window.location.search);
  const search = searchParams.get("name");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "name", value: search ?? "" },
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
    state: {
      sorting,
      columnFilters,
    },
  });

  const platformSelectDisabled =
    selectedLeaderboardVersion !== LEADERBOARD_VERSION.LIVE || loading;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Tabs
          defaultValue={selectedPlatform}
          onValueChange={e => setSelectedPlatform(e as Platforms)}
        >
          <TabsList>
            <TabsTrigger
              value={Platforms.Crossplay}
              title="Crossplay"
              disabled={platformSelectDisabled}
            >
              <Icons.crossplay className="h-5 w-5 inline" />
            </TabsTrigger>
            <TabsTrigger
              value={Platforms.Steam}
              title="Steam"
              disabled={platformSelectDisabled}
            >
              <Icons.steam className="h-5 w-5 inline" />
            </TabsTrigger>
            <TabsTrigger
              value={Platforms.Xbox}
              title="Xbox"
              disabled={platformSelectDisabled}
            >
              <Icons.xbox className="h-5 w-5 inline" />
            </TabsTrigger>
            <TabsTrigger
              value={Platforms.PSN}
              title="PlayStation"
              disabled={platformSelectDisabled}
            >
              <Icons.playstation className="h-5 w-5 inline" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          className="max-w-xs"
          placeholder="Filter usernames..."
          maxLength={20}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={event => {
            table.getColumn("name")?.setFilterValue(event.target.value);

            event.target.value.length
              ? searchParams.set("name", event.target.value)
              : searchParams.delete("name");
            window.history.replaceState(
              null,
              "",
              searchParams.size > 0 ? `?${searchParams.toString()}` : "/"
            );
          }}
        />
      </div>

      <div className="rounded-md border">
        <Table className="table-fixed min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
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

      <DataTablePagination table={table} />
    </div>
  );
}
