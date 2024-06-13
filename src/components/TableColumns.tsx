import { createColumnHelper } from "@tanstack/react-table";
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
import fameToRankIcon from "@/utils/fameToRankIcon";
import leagueNumberToIcon from "@/utils/leagueNumberToIcon";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { BaseUser, Platforms, BaseUserWithExtras } from "@/types";
import leagueIsLive from "@/utils/leagueIsLive";
import { LeaderboardId } from "@/utils/leaderboards";

const columnHelper = createColumnHelper<BaseUserWithExtras>();

export const columns = (
  leaderboardId: LeaderboardId,
  selectedPlatform: Platforms,
) => [
  // Rank
  columnHelper.accessor("rank", {
    id: "rank",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rank" />
    ),
    cell: ({ getValue }) => getValue().toLocaleString("en"),
  }),

  // Change
  columnHelper.accessor("change", {
    id: "change",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="24h change" />
    ),
    cell: ({ getValue }) => {
      const value = getValue();
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
  }),

  // Name
  columnHelper.accessor(
    user =>
      `${user.name} ${user.steamName ?? ""} ${user.xboxName ?? ""} ${
        user.psnName ?? ""
      }`.toLowerCase(),
    {
      id: "name",
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
            {leagueIsLive(leaderboardId) && (
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
    },
  ),

  // XP
  columnHelper.accessor("xp", {
    id: "xp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="XP" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  columnHelper.accessor("level", {
    id: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Level" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Cashouts
  columnHelper.accessor("cashouts", {
    id: "cashouts",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cashouts" />
    ),
    cell: ({ getValue }) =>
      (getValue() ?? 0).toLocaleString("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
  }),

  // Fame
  columnHelper.accessor(
    user => ({
      fame: user.fame,
      rankScore: user.rankScore,
      leagueNumber: user.leagueNumber,
      league: user.league,
    }),
    {
      id: "fame",
      filterFn: (value, _, filterValue: string[]) =>
        !filterValue.length || filterValue.includes(value.original.league),
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title="League" />;
      },
      cell: ({ getValue }) => {
        const { fame, rankScore, leagueNumber, league } = getValue();
        return (
          <Popover>
            <PopoverTrigger className="flex items-center gap-2 rounded px-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800">
              <div className="size-[50px]">
                {leagueNumber
                  ? leagueNumberToIcon(leagueNumber, 50)
                  : fameToRankIcon(leaderboardId, fame ?? 0)}
              </div>

              <div className="flex flex-col">
                <span>{league}</span>
                {(fame || rankScore) && (
                  <span>{(fame ?? rankScore ?? 0).toLocaleString("en")}</span>
                )}
              </div>
            </PopoverTrigger>

            <PopoverContent className="flex flex-col items-center justify-center font-saira">
              <span className="text-xl font-medium">{league}</span>
              {(fame || rankScore) && (
                <span>
                  {(fame ?? rankScore ?? 0).toLocaleString("en")}{" "}
                  {rankScore ? "Rank Score" : "fame point"}
                </span>
              )}
              {leagueNumber
                ? leagueNumberToIcon(leagueNumber, 160)
                : fameToRankIcon(leaderboardId, fame ?? 0, 160)}
            </PopoverContent>
          </Popover>
        );
      },
    },
  ),

  // Distance
  columnHelper.accessor("distance", {
    id: "distance",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Distance" />
    ),
    cell: ({ getValue }) =>
      `${(getValue() ?? 0).toLocaleString("en", {
        style: "decimal",
        maximumFractionDigits: 2,
      })} km`,
  }),

  // Games Won
  columnHelper.accessor("gamesWon", {
    id: "gamesWon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Games Won" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Rounds Won
  columnHelper.accessor("roundsWon", {
    id: "roundsWon",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rounds Won" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Total Rounds
  columnHelper.accessor("totalRounds", {
    id: "totalRounds",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Rounds" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Eliminations
  columnHelper.accessor("eliminations", {
    id: "eliminations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Eliminations" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Score
  columnHelper.accessor("score", {
    id: "score" as const,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),

  // Score
  columnHelper.accessor("damageDone", {
    id: "damageDone" as const,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Damage Done" />
    ),
    cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
  }),
];

const platformNamesInline = (user: BaseUser) => {
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

const namePopoverContent = (user: BaseUser) => {
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
