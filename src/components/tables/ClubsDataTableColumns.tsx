import {
  AccessorKeyColumnDef,
  createColumnHelper,
} from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Club, panels } from "@/types";
import { LeaderboardId } from "@/utils/leaderboards";
import { Link, useNavigate } from "@tanstack/react-router";
import { HomeIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { clubsQueryOptions } from "@/queries";

const columnHelper = createColumnHelper<Club>();

export const clubsDataTableColumns = (leaderboardId: LeaderboardId) => {
  const navigate = useNavigate({ from: "/" });
  const queryClient = useQueryClient();

  const columns = [
    // Rank
    columnHelper.accessor("rank", {
      id: "rank",
      invertSorting: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rank" />
      ),
      cell: ({ getValue }) => getValue().toLocaleString("en"),
    }),

    // Club Tag
    columnHelper.accessor("clubTag", {
      id: "clubTag",
      filterFn: (value, _, filterValue: string) => {
        if (filterValue.startsWith("exactCt:")) {
          const clubTag = filterValue.replace("exactCt:", "");
          return value.original.clubTag.toLowerCase() === clubTag.toLowerCase();
        }

        // Fallback to default filter
        return value.original.clubTag
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Club Tag" />
      ),
      cell: ({ getValue }) => (
        <span className="mr-1 rounded bg-neutral-200 px-1 dark:bg-neutral-800">
          {" "}
          {getValue()}
        </span>
      ),
    }),

    // Members
    columnHelper.accessor("members", {
      id: "members",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Members (in top 10K)" />
      ),
      cell: ({ getValue, row }) => (
        <button
          className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 tabular-nums transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          title="View members"
          onClick={() => {
            navigate({
              search: (prev) => ({
                ...prev,
                panel: panels.LEADERBOARD,
                name: `clubTag:${row.original.clubTag}`,
              }),
            });
          }}
        >
          {getValue().toLocaleString("en")}
        </button>
      ),
    }),
  ];

  const columnsByLeaderboard: [
    AccessorKeyColumnDef<Club, number>,
    LeaderboardId[],
  ][] = [
    [totalRankScoreColumn, ["season5", "season6", "season7"]],
    [totalFansColumn, ["season5Sponsor", "season6Sponsor", "season7Sponsor"]],
    [
      totalCashoutsColumn,
      ["season5WorldTour", "season6WorldTour", "season7WorldTour"],
    ],
    [
      totalPointsColumn,
      [
        "season5TerminalAttack",
        "season5PowerShift",
        "season5QuickCash",
        "season5BankIt",
        "season6TerminalAttack",
        "season6PowerShift",
        "season6QuickCash",
        "season6TeamDeathmatch",
        "season6HeavyHitters",
        "season7TerminalAttack",
        "season7PowerShift",
        "season7QuickCash",
        "season7TeamDeathmatch",
        "season7BlastOff",
        "season7CashBall",
      ],
    ],
  ];

  const colMap = Object.fromEntries(
    columnsByLeaderboard.flatMap(([col, ids]) => ids.map((id) => [id, col])),
  );

  // Add columns based on the leaderboardId
  colMap[leaderboardId] && columns.push(colMap[leaderboardId]);

  columns.push(
    // @ts-ignore It's just because the array have previously been just accessor columns
    columnHelper.display({
      header: "Links",
      cell: ({ row }) => (
        <Link
          to="/clubs/$clubTag"
          params={{ clubTag: row.original.clubTag }}
          // Remove the panel search param
          search={(prev) => ({ ...prev, panel: undefined })}
        >
          <Button
            variant="outline"
            size="icon"
            onPointerEnter={() => {
              queryClient.prefetchQuery(clubsQueryOptions);
            }}
          >
            <HomeIcon className="!size-5" />
          </Button>
        </Link>
      ),
    }),
  );

  return columns;
};

// Total Rank Score
const totalRankScoreColumn = columnHelper.accessor("totalValue", {
  id: "rankScore",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Rank Score" />
  ),
  cell: ({ getValue }) => getValue().toLocaleString("en"),
});

// Total Fans
const totalFansColumn = columnHelper.accessor("totalValue", {
  id: "fans",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Fans" />
  ),
  cell: ({ getValue }) => getValue().toLocaleString("en"),
});

// Total Cashouts
const totalCashoutsColumn = columnHelper.accessor("totalValue", {
  id: "cashouts",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Cashouts" />
  ),
  cell: ({ getValue }) =>
    getValue().toLocaleString("en", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }),
});

// Total Points
const totalPointsColumn = columnHelper.accessor("totalValue", {
  id: "points",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Points" />
  ),
  cell: ({ getValue }) => getValue().toLocaleString("en"),
});
