import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";

// TODO: Add XP and level for CB1

export const columns = (leaderboardVersion: LEADERBOARD_VERSION) =>
  [
    {
      accessorKey: "rank",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rank
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "change",
      header: "24h change",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "cashouts",
      header: "Cashouts",
    },
    {
      accessorKey: "fame",
      header: "Fame",
    },
  ] satisfies ColumnDef<User>[];
