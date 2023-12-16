import { ArrowUpDown } from "lucide-react";
import { Column, ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Icons from "./icons";
import { cn } from "@/lib/utils";
import fameToRankIcon from "@/helpers/fameToRankIcon";
import fameToLeague from "@/helpers/fameToLeague";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";
import { User } from "@/types";

export const columns = (
  leaderboardVersion: LEADERBOARD_VERSION
): ColumnDef<User>[] => {
  const rankColumn = {
    accessorKey: "rank",
    invertSorting: true,
    header: ({ column }) => headerSort("Rank", column),
    cell: ({ getValue }) => (getValue() as number).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const changeColumn = {
    accessorKey: "change",
    header: ({ column }) => headerSort("24h change", column),
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span
          className={cn(
            value > 0 ? "text-green-600" : value === 0 ? "" : "text-red-500"
          )}
        >
          {value > 0
            ? `+${value.toLocaleString("en")}`
            : value.toLocaleString("en")}
        </span>
      );
    },
  } satisfies ColumnDef<User>;

  const nameColumn = {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original: user } }) => {
      return user.steamName || user.xboxName || user.psnName ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="w-fit">
              <span className="flex flex-col">{platformNamesInline(user)}</span>
            </TooltipTrigger>
            <TooltipContent>{namePopoverContent(user)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        user.name
      );
    },
  } satisfies ColumnDef<User>;

  const xpColumn = {
    accessorKey: "xp",
    header: ({ column }) => headerSort("XP", column),
    cell: ({ getValue }) => ((getValue() as number) ?? 0).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const levelColumn = {
    accessorKey: "level",
    header: ({ column }) => headerSort("Level", column),
    cell: ({ getValue }) => ((getValue() as number) ?? 0).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const cashoutsColumn = {
    accessorKey: "cashouts",
    header: ({ column }) => headerSort("Cashouts", column),
    cell: ({ getValue }) =>
      (getValue() as number).toLocaleString("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
  } satisfies ColumnDef<User>;

  const fameColumn = {
    accessorKey: "fame",
    header: ({ column }) => headerSort("Fame", column),
    cell: ({ getValue }) => (
      <span className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger>
            {fameToRankIcon(leaderboardVersion, getValue() as number)}{" "}
            {(getValue() as number).toLocaleString("en")}
          </PopoverTrigger>
          <PopoverContent className="flex justify-center flex-col items-center">
            <span className="font-medium text-xl">
              {fameToLeague(leaderboardVersion, getValue() as number)}
            </span>
            {fameToRankIcon(leaderboardVersion, getValue() as number, 160)}
          </PopoverContent>
        </Popover>
      </span>
    ),
  } satisfies ColumnDef<User>;

  const columns = [
    rankColumn,
    changeColumn,
    nameColumn,
    xpColumn,
    levelColumn,
    cashoutsColumn,
    fameColumn,
  ];

  if (leaderboardVersion === LEADERBOARD_VERSION.CLOSED_BETA_1) return columns;

  return columns.filter(
    column => column.accessorKey !== "xp" && column.accessorKey !== "level"
  );
};

const headerSort = (text: string, column: Column<User, unknown>) => (
  <Button
    variant="ghost"
    className="p-0 w-full text-left flex justify-start hover:underline"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {text}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

const platformNamesInline = (user: User) => {
  return (
    <div className="flex flex-col">
      <span>{user.name}</span>
      {user.steamName && (
        <span>
          <Icons.steam className="h-5 w-5 inline opacity-60" /> {user.steamName}
        </span>
      )}
      {user.xboxName && (
        <span>
          <Icons.xbox className="h-5 w-5 inline opacity-60" /> {user.xboxName}
        </span>
      )}
      {user.psnName && (
        <span>
          <Icons.playstation className="h-5 w-5 inline opacity-60" />{" "}
          {user.psnName}
        </span>
      )}
    </div>
  );
};

const namePopoverContent = (user: User) => {
  if (!user.steamName && !user.xboxName && !user.psnName) return;
  return (
    <div className="flex flex-col gap-2">
      <span>
        <img src="/images/Embark.png" className="inline w-5 h-5" />{" "}
        <span className="font-bold">Embark ID</span>: {user.name}
      </span>
      {user.steamName && (
        <span>
          <Icons.steam className="h-5 w-5 inline" />{" "}
          <span className="font-bold">Steam:</span> {user.steamName}
        </span>
      )}
      {user.xboxName && (
        <span>
          <Icons.xbox className="h-5 w-5 inline" />{" "}
          <span className="font-bold">Xbox:</span> {user.xboxName}
        </span>
      )}
      {user.psnName && (
        <span>
          <Icons.playstation className="h-5 w-5 inline" />{" "}
          <span className="font-bold">PlayStation:</span> {user.psnName}
        </span>
      )}
    </div>
  );
};
