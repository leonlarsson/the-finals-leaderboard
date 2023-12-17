import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Icons from "./icons";
import { cn } from "@/lib/utils";
import fameToRankIcon from "@/helpers/fameToRankIcon";
import fameToLeague from "@/helpers/fameToLeague";
import { LEADERBOARD_VERSION } from "@/helpers/leagues";
import { Platforms, User } from "@/types";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

export const columns = (
  leaderboardVersion: LEADERBOARD_VERSION,
  selectedPlatform: Platforms
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
              <Icons.steam className="h-5 w-5 inline opacity-60" />
            )}
          {leaderboardVersion === LEADERBOARD_VERSION.LIVE &&
            selectedPlatform === "xbox" && (
              <Icons.xbox className="h-5 w-5 inline opacity-60" />
            )}
          {leaderboardVersion === LEADERBOARD_VERSION.LIVE &&
            selectedPlatform === "psn" && (
              <Icons.playstation className="h-5 w-5 inline opacity-60" />
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

const platformNamesInline = (user: User) => {
  return (
    <div className="flex flex-col gap-1">
      <span>{user.name}</span>

      {user.steamName && (
        <span className="inline-flex gap-1">
          <Icons.steam className="h-5 w-5 inline opacity-60" /> {user.steamName}
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex gap-1">
          <Icons.xbox className="h-5 w-5 inline opacity-60" /> {user.xboxName}
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex gap-1">
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
      <span className="inline-flex gap-1">
        <img src="/images/Embark.png" className="inline w-5 h-5" />{" "}
        <span className="font-semibold">Embark ID:</span> {user.name}
      </span>

      {user.steamName && (
        <span className="inline-flex gap-1">
          <Icons.steam className="h-5 w-5 inline" />{" "}
          <span className="font-semibold">Steam:</span> {user.steamName}
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex gap-1">
          <Icons.xbox className="h-5 w-5 inline" />{" "}
          <span className="font-semibold">Xbox:</span> {user.xboxName}
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex gap-1">
          <Icons.playstation className="h-5 w-5 inline" />{" "}
          <span className="font-semibold">PlayStation:</span> {user.psnName}
        </span>
      )}
    </div>
  );
};
