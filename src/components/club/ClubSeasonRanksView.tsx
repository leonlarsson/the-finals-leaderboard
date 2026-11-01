import { Link } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TrophyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import LeagueImage from "@/components/LeagueImage";
import { DataTableColumnHeader } from "@/components/tables/DataTableColumnHeader";
import { DataTablePagination } from "@/components/tables/DataTablePagination";
import { SHORT_LIST_ROWS } from "@/components/tables/LeaderboardDataTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BaseUserWithExtras } from "@/types";
import {
  defaultLeaderboardId,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";
import { splitPlayerName } from "@/utils/playerName";
import { ClubEmptyState } from "./ClubEmptyState";
import { CLUB_MEMBERS_PAGE_SIZE_KEY } from "./clubSearch";
import { currentSeason, stripSeasonPrefix } from "./clubSeason";
import { useClubLeaderboards } from "./useClubLeaderboard";

type SeasonRow = {
  name: string;
  entries: Map<LeaderboardId, BaseUserWithExtras>;
};

const columnHelper = createColumnHelper<SeasonRow>();

type ClubSeasonRanksViewProps = {
  clubTag: string;
  /** Current season leaderboards the club has members on, in `leaderboards` order */
  seasonLbIds: LeaderboardId[];
};

/** Every member on every current season leaderboard, to see who plays what */
export const ClubSeasonRanksView = ({
  clubTag,
  seasonLbIds,
}: ClubSeasonRanksViewProps) => {
  const queries = useClubLeaderboards(seasonLbIds, clubTag);

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);
  // useQueries returns a new array every render, so key the rows on when the data last changed
  const dataKey = queries.map((query) => query.dataUpdatedAt).join();

  // One row per member with their entry on each leaderboard, by best rank anywhere.
  // Sorting is stable, so members without a rank in the sorted column keep this order
  // biome-ignore lint/correctness/useExhaustiveDependencies: dataKey tracks the query data
  const rows = useMemo(() => {
    const byName = new Map<string, SeasonRow>();
    seasonLbIds.forEach((id, i) => {
      for (const user of queries[i]?.data ?? []) {
        const key = user.name.toLowerCase();
        if (!byName.has(key)) {
          byName.set(key, { name: user.name, entries: new Map() });
        }
        byName.get(key)!.entries.set(id, user);
      }
    });
    const bestRank = (row: SeasonRow) =>
      Math.min(...Array.from(row.entries.values(), (user) => user.rank));
    return Array.from(byName.values()).sort(
      (a, b) => bestRank(a) - bestRank(b),
    );
  }, [seasonLbIds, dataKey]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Member" />
        ),
        cell: ({ getValue }) => {
          const { name, tag } = splitPlayerName(getValue());
          return (
            <Link
              to="/players/$playerName"
              params={{ playerName: getValue() }}
              className="inline-flex items-center gap-1 whitespace-nowrap font-medium hover:underline"
            >
              {name}
              {tag !== undefined && (
                <span className="font-normal text-neutral-500">#{tag}</span>
              )}
            </Link>
          );
        },
      }),
      ...seasonLbIds.map((id) =>
        columnHelper.accessor((row) => row.entries.get(id)?.rank, {
          id,
          sortUndefined: "last",
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={stripSeasonPrefix(leaderboards[id].name, currentSeason)}
              className="whitespace-nowrap"
            />
          ),
          cell: ({ row }) => {
            const user = row.original.entries.get(id);
            const hasLeagues =
              leaderboards[id].features.includes("leagueFilter");
            return (
              <span className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap">
                {hasLeagues && (
                  <span className="inline-flex w-6 justify-center">
                    {user?.league && (
                      <LeagueImage league={user.league} size={24} />
                    )}
                  </span>
                )}
                {user ? (
                  `#${user.rank.toLocaleString("en")}`
                ) : (
                  <span className="text-neutral-400">—</span>
                )}
              </span>
            );
          },
        }),
      ),
    ],
    [seasonLbIds],
  );

  // Best rank on the ranked leaderboard first
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortId = seasonLbIds.includes(defaultLeaderboardId)
      ? defaultLeaderboardId
      : seasonLbIds[0];
    return sortId ? [{ id: sortId, desc: false }] : [];
  });

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
    state: { sorting },
    initialState: {
      pagination: {
        pageSize: Math.min(
          Number(localStorage.getItem(CLUB_MEMBERS_PAGE_SIZE_KEY)) || 10,
          100,
        ),
      },
    },
  });

  if (seasonLbIds.length === 0) {
    return (
      <ClubEmptyState
        icon={TrophyIcon}
        title={`Not active in ${currentSeason}`}
        description={`No members are in the top 10K of a ${currentSeason} leaderboard.`}
      />
    );
  }

  if (hasError) {
    return (
      <ErrorState
        title="Failed to load leaderboard data"
        onRetry={() => {
          for (const query of queries) {
            if (query.isError) query.refetch();
          }
        }}
      />
    );
  }

  // Same rule as the leaderboard tables: short lists don't need pagination
  const showPagination =
    !isLoading && (table.getPageCount() > 1 || rows.length > SHORT_LIST_ROWS);

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">
        Where each member ranks on the {currentSeason} leaderboards.
      </p>

      <div className="space-y-2">
        {showPagination && (
          <DataTablePagination
            table={table}
            type="members"
            pageSizeStorageKey={CLUB_MEMBERS_PAGE_SIZE_KEY}
          />
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-inherit">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={
                        header.column.id === "name"
                          ? "sticky left-0 z-10 bg-background"
                          : undefined
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      {columns.map((_, j) => (
                        <TableCell key={j} className="p-3">
                          <div
                            className={`h-5 rounded bg-neutral-200 dark:bg-neutral-700 ${j === 0 ? "w-32" : "w-14"}`}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="group">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          // Opaque hover color, so the sticky cell still covers the cells scrolled under it
                          className={`p-3 ${cell.column.id === "name" ? "sticky left-0 z-10 bg-background group-hover:bg-muted" : ""}`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {showPagination && (
          <DataTablePagination
            table={table}
            type="members"
            pageSizeStorageKey={CLUB_MEMBERS_PAGE_SIZE_KEY}
          />
        )}
      </div>
    </div>
  );
};
