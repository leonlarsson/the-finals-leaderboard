import { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
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
import leagueNumberToIcon from "@/helpers/leagueNumberToIcon";
import { LEADERBOARD_VERSION, leagueIsLive } from "@/helpers/leagues";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Platforms, User } from "@/types";

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
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild className="w-fit">
              {platformNamesInline(user)}
            </TooltipTrigger>
            <TooltipContent>{namePopoverContent(user)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="inline-flex gap-1">
          {leagueIsLive(leaderboardVersion) && (
            <>
              {selectedPlatform === "steam" && (
                <Icons.steam className="inline size-5 opacity-60" />
              )}
              {selectedPlatform === "xbox" && (
                <Icons.xbox className="inline size-5 opacity-60" />
              )}
              {selectedPlatform === "psn" && (
                <Icons.playstation className="inline size-5 opacity-60" />
              )}
            </>
          )}
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
    accessorFn: user => ({
      fame: user.fame,
      leagueNumber: user.leagueNumber,
      league: user.league,
    }),
    filterFn: (value, _, filterValue: string[]) =>
      !filterValue.length || filterValue.includes(value.original.league),
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Fame" />;
    },
    cell: ({ getValue }) => {
      const { fame, leagueNumber, league } = getValue() as {
        fame?: number;
        leagueNumber?: number;
        league: string;
      };
      return (
        <Popover>
          <PopoverTrigger className="flex items-center gap-2 rounded px-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <div className="size-[60px]">
              {leagueNumber
                ? leagueNumberToIcon(leagueNumber)
                : fameToRankIcon(leaderboardVersion, fame ?? 0)}
            </div>

            <div className="flex flex-col">
              <span>{league}</span>
              {fame && <span>{fame.toLocaleString("en")}</span>}
            </div>
          </PopoverTrigger>

          <PopoverContent className="flex flex-col items-center justify-center font-saira">
            <span className="text-xl font-medium">{league}</span>
            {fame && <span>{fame.toLocaleString("en")} fame points</span>}
            {leagueNumber
              ? leagueNumberToIcon(leagueNumber, 160)
              : fameToRankIcon(leaderboardVersion, fame ?? 0, 160)}
          </PopoverContent>
        </Popover>
      );
    },
  } satisfies ColumnDef<User>;

  // const historyColumn = {
  //   accessorKey: "history",
  //   header: "History",
  //   cell: ({ row }) => (
  //     <Button
  //       variant={"outline"}
  //       size={"icon"}
  //       title={
  //         row.getIsExpanded()
  //           ? "Close this user's history."
  //           : "Show this user's history."
  //       }
  //       onClick={() => row.toggleExpanded()}
  //     >
  //       <span className="text-neutral-700 dark:text-neutral-400">
  //         {row.getIsExpanded() ? <EyeOff /> : <Eye />}
  //       </span>
  //     </Button>
  //   ),
  // } satisfies ColumnDef<User>;

  const columns = {
    [LEADERBOARD_VERSION.CLOSED_BETA_1]: [
      rankColumn,
      changeColumn,
      nameColumn,
      xpColumn,
      levelColumn,
      cashoutsColumn,
      fameColumn,
    ],
    [LEADERBOARD_VERSION.CLOSED_BETA_2]: [
      rankColumn,
      changeColumn,
      nameColumn,
      cashoutsColumn,
      fameColumn,
    ],
    [LEADERBOARD_VERSION.OPEN_BETA]: [
      rankColumn,
      changeColumn,
      nameColumn,
      cashoutsColumn,
      fameColumn,
    ],
    [LEADERBOARD_VERSION.SEASON_1]: [
      rankColumn,
      changeColumn,
      nameColumn,
      cashoutsColumn,
      fameColumn,
    ],
    [LEADERBOARD_VERSION.SEASON_2]: [
      rankColumn,
      changeColumn,
      nameColumn,
      fameColumn,
    ],
  };

  return columns[leaderboardVersion];
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
        <img src="/images/Embark.png" className="inline size-5 dark:hidden" />
        <img
          src="/images/Embark-White.png"
          className="hidden size-5 dark:inline"
        />
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
