import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import Icons from "./icons";
import { cn } from "@/lib/utils";
import fameToRankIcon from "@/helpers/fameToRankIcon";
import fameToLeague from "@/helpers/fameToLeague";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";
import { Platforms, User } from "@/types";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

export const columns = (
  leaderboardVersion: LEADERBOARD_VERSION,
  selectedPlatform: Platforms,
): ColumnDef<User>[] => {
  const rankColumn = {
    accessorKey: "rank",
    // invertSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
    cell: ({ getValue }) => (getValue() as number).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const changeColumn = {
    accessorKey: "change",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="24h change" />
    ),
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return (
        <span
          className={cn(
            value > 0 ? "text-green-700" : value === 0 ? "" : "text-red-600",
          )}
        >
          {value > 0 ? (
            <span className="inline-flex items-center">
              {<ChevronUp className="inline h-6" />}
              {value.toLocaleString("en")}
            </span>
          ) : value < 0 ? (
            <span className="inline-flex items-center">
              {<ChevronDown className="inline h-6" />}
              {Math.abs(value).toLocaleString("en")}
            </span>
          ) : (
            <span className="inline-flex items-center">
              {<Minus className="inline h-5" />}
              {value.toLocaleString("en")}
            </span>
          )}
        </span>
      );
    },
  } satisfies ColumnDef<User>;

  const nameColumn = {
    accessorKey: "name",
    // This to make filtering easier
    accessorFn: user =>
      `${user.name} ${user.steamName ?? ""} ${user.xboxName ?? ""} ${
        user.psnName ?? ""
      }`.toLowerCase(),
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
        <span className="inline-flex gap-1">
          {leaderboardVersion === LEADERBOARD_VERSION.LIVE &&
            selectedPlatform === "steam" && (
              <Icons.steam className="inline size-5 opacity-60" />
            )}
          {leaderboardVersion === LEADERBOARD_VERSION.LIVE &&
            selectedPlatform === "xbox" && (
              <Icons.xbox className="inline size-5 opacity-60" />
            )}
          {leaderboardVersion === LEADERBOARD_VERSION.LIVE &&
            selectedPlatform === "psn" && (
              <Icons.playstation className="inline size-5 opacity-60" />
            )}{" "}
          {user.name}
        </span>
      );
    },
  } satisfies ColumnDef<User>;

  const xpColumn = {
    accessorKey: "xp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="XP" />
    ),
    cell: ({ getValue }) => ((getValue() as number) ?? 0).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const levelColumn = {
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ getValue }) => ((getValue() as number) ?? 0).toLocaleString("en"),
  } satisfies ColumnDef<User>;

  const cashoutsColumn = {
    accessorKey: "cashouts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cashouts" />
    ),
    cell: ({ getValue }) =>
      (getValue() as number).toLocaleString("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
  } satisfies ColumnDef<User>;

  const fameColumn = {
    accessorKey: "fame",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fame" />
    ),
    cell: ({ getValue }) => (
      <span className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger className="flex items-center gap-2 rounded px-1 transition-colors hover:bg-neutral-200">
            {fameToRankIcon(leaderboardVersion, getValue() as number)}{" "}
            <div className="flex flex-col">
              <span>
                {fameToLeague(leaderboardVersion, getValue() as number)}
              </span>
              <span>{(getValue() as number).toLocaleString("en")}</span>
            </div>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col items-center justify-center">
            <span className="text-xl font-medium">
              {fameToLeague(leaderboardVersion, getValue() as number)}
            </span>
            <span>
              {(getValue() as number).toLocaleString("en")} fame points
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
    column => column.accessorKey !== "xp" && column.accessorKey !== "level",
  );
};

const platformNamesInline = (user: User) => {
  return (
    <div className="flex flex-col gap-1">
      <span>{user.name}</span>

      {user.steamName && (
        <span className="inline-flex gap-1">
          <Icons.steam className="inline size-5 opacity-60" /> {user.steamName}
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex gap-1">
          <Icons.xbox className="inline size-5 opacity-60" /> {user.xboxName}
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex gap-1">
          <Icons.playstation className="inline size-5 opacity-60" />{" "}
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
      <span className="inline-flex gap-1">
        <img src="/images/Embark.png" className="inline size-5" />{" "}
        <span className="font-semibold">Embark ID:</span> {user.name}
      </span>

      {user.steamName && (
        <span className="inline-flex gap-1">
          <Icons.steam className="inline size-5" />{" "}
          <span className="font-semibold">Steam:</span> {user.steamName}
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex gap-1">
          <Icons.xbox className="inline size-5" />{" "}
          <span className="font-semibold">Xbox:</span> {user.xboxName}
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex gap-1">
          <Icons.playstation className="inline size-5" />{" "}
          <span className="font-semibold">PlayStation:</span> {user.psnName}
        </span>
      )}
    </div>
  );
};
