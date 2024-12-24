import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Club, panels } from "@/types";
import { LeaderboardId } from "@/utils/leaderboards";
import { useNavigate } from "@tanstack/react-router";

const columnHelper = createColumnHelper<Club>();

export const clubsDataTableColumns = (leaderboardId: LeaderboardId) => {
  const navigate = useNavigate({ from: "/" });

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
        if (filterValue.startsWith("exact:")) {
          const clubTag = filterValue.replace("exact:", "");
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

  if (leaderboardId === "season5") {
    columns.push(totalRankScoreColumn);
  }

  if (leaderboardId === "season5Sponsor") {
    columns.push(totalFansColumn);
  }

  if (leaderboardId === "season5WorldTour") {
    columns.push(totalCashoutsColumn);
  }

  if (
    leaderboardId === "season5TerminalAttack" ||
    leaderboardId === "season5PowerShift" ||
    leaderboardId === "season5QuickCash" ||
    leaderboardId === "season5BankIt"
  ) {
    columns.push(totalPointsColumn);
  }

  return columns;
};

// Total Rank Score
const totalRankScoreColumn = columnHelper.accessor("totalRankScore", {
  id: "rankScore",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Rank Score" />
  ),
  cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
});

// Total Fans
const totalFansColumn = columnHelper.accessor("totalFans", {
  id: "fans",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Fans" />
  ),
  cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
});

// Total Cashouts
const totalCashoutsColumn = columnHelper.accessor("totalCashouts", {
  id: "cashouts",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Cashouts" />
  ),
  cell: ({ getValue }) =>
    (getValue() ?? 0).toLocaleString("en", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }),
});

// Total Points
const totalPointsColumn = columnHelper.accessor("totalPoints", {
  id: "points",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Total Points" />
  ),
  cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
});
