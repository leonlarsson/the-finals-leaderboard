import { createColumnHelper } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { BaseUser, BaseUserWithExtras, panels } from "@/types";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import { SponsorImage } from "../SponsorImage";
import LeagueImage from "../LeagueImage";
import { useNavigate } from "@tanstack/react-router";
import { PlayStationIcon, SteamIcon, XboxIcon } from "../icons";

const columnHelper = createColumnHelper<BaseUserWithExtras>();

export const leaderboardDataTableColumns = (
  leaderboardId: LeaderboardId,
  selectedPlatform: string | undefined,
) => {
  return [
    // Rank
    columnHelper.accessor("rank", {
      id: "rank",
      invertSorting: true,
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
        return value > 0 ? (
          <span className="inline-flex items-center text-indigo-400 dark:text-indigo-300">
            {<ChevronUp className="inline h-6" />}
            {value.toLocaleString("en")}
          </span>
        ) : value < 0 ? (
          <span className="inline-flex items-center text-red-500 dark:text-red-500">
            {<ChevronDown className="inline h-6" />}
            {Math.abs(value).toLocaleString("en")}
          </span>
        ) : (
          <span className="inline-flex items-center text-neutral-500 dark:text-neutral-400">
            {<Minus className="inline h-5" />}
            {value.toLocaleString("en")}
          </span>
        );
      },
    }),

    // Name
    columnHelper.accessor(
      (user) =>
        `${user.clubTag ?? ""} ${user.name} ${user.steamName ?? ""} ${user.xboxName ?? ""} ${
          user.psnName ?? ""
        }`.toLowerCase(),
      {
        id: "name",
        filterFn: (value, _, filterValue: string) => {
          // Filter by exact club tag
          if (filterValue.startsWith("clubTag:")) {
            const clubTag = filterValue.replace("clubTag:", "");
            return (
              value.original.clubTag?.toLowerCase() === clubTag.toLowerCase()
            );
          }

          // Regular filter
          const regularFilterableValue =
            `${value.original.name} ${value.original.steamName} ${value.original.xboxName} ${value.original.psnName} ${value.original.clubTag}`.toLowerCase();
          return regularFilterableValue.includes(filterValue.toLowerCase());
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row: { original: user } }) => {
          // If user has a non-empty platform name, show it in a tooltip
          // If no platform names are present, show just the Embark name
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
              {/* If platform selection is enabled, add the selected platform icon before the name */}
              {leaderboards[leaderboardId].features.includes(
                "platformSelection",
              ) && (
                <>
                  {selectedPlatform === "steam" && (
                    <SteamIcon className="inline size-5 opacity-60" />
                  )}
                  {selectedPlatform === "xbox" && (
                    <XboxIcon className="inline size-5 opacity-60" />
                  )}
                  {selectedPlatform === "psn" && (
                    <PlayStationIcon className="inline size-5 opacity-60" />
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
      (user) => ({
        fame: user.fame,
        rankScore: user.rankScore,
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
          const { fame, rankScore, league } = getValue();
          return (
            <Popover>
              <PopoverTrigger className="flex items-center gap-2 rounded px-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800">
                <div className="size-[50px]">
                  {league && <LeagueImage league={league} size={50} />}
                </div>

                <div className="flex flex-col items-start">
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
                    {rankScore ? "Rank Score" : "fame points"}
                  </span>
                )}
                {league && <LeagueImage league={league} size={160} />}
              </PopoverContent>
            </Popover>
          );
        },
      },
    ),

    // Sponsor
    columnHelper.accessor("sponsor", {
      id: "sponsor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sponsor" />
      ),
      cell: ({ getValue }) => (
        <div className="flex flex-col gap-2">
          <SponsorImage sponsor={getValue() ?? ""} size={80} />
        </div>
      ),
    }),

    // Fans
    columnHelper.accessor("fans", {
      id: "fans",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fans" />
      ),
      cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
    }),

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

    // Points
    columnHelper.accessor("points", {
      id: "points" as const,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Points" />
      ),
      cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
    }),

    // Damage Done
    columnHelper.accessor("damageDone", {
      id: "damageDone" as const,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Damage Done" />
      ),
      cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
    }),

    // Tournament Wins
    columnHelper.accessor("tournamentWins", {
      id: "tournamentWins",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tournament Wins" />
      ),
      cell: ({ getValue }) => (getValue() ?? 0).toLocaleString("en"),
    }),
  ];
};

const platformNamesInline = (user: BaseUser) => {
  return (
    <div className="flex flex-col gap-1">
      <div>
        {user.clubTag && <ClickableClubTag clubTag={user.clubTag} />}
        <span className="font-medium">{user.name.split("#")[0]}</span>
        <span className="text-neutral-500">#{user.name.split("#")[1]}</span>
      </div>

      {user.steamName && (
        <span className="inline-flex items-center gap-1">
          <SteamIcon className="inline size-5 opacity-60" />
          <span>{user.steamName}</span>
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex items-center gap-1">
          <XboxIcon className="inline size-5 opacity-60" />
          <span>{user.xboxName}</span>
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex items-center gap-1">
          <PlayStationIcon className="inline size-5 opacity-60" />
          <span>{user.psnName}</span>
        </span>
      )}
    </div>
  );
};

const namePopoverContent = (user: BaseUser) => {
  if (!user.steamName && !user.xboxName && !user.psnName) return;
  return (
    <div className="flex flex-col gap-2">
      {user.clubTag && (
        <span>
          Club tag: <ClickableClubTag clubTag={user.clubTag} />
        </span>
      )}

      <span className="inline-flex gap-1">
        <img
          src="/images/misc/Embark.png"
          className="inline size-5 dark:hidden"
        />
        <img
          src="/images/misc/Embark-White.png"
          className="hidden size-5 dark:inline"
        />
        <span className="font-semibold">Embark ID:</span>
        <span>{user.name}</span>
      </span>

      {user.steamName && (
        <span className="inline-flex gap-1">
          <SteamIcon className="inline size-5" />
          <span className="font-semibold">Steam:</span>
          <span>{user.steamName}</span>
        </span>
      )}

      {user.xboxName && (
        <span className="inline-flex gap-1">
          <XboxIcon className="inline size-5" />
          <span className="font-semibold">Xbox:</span>
          <span>{user.xboxName}</span>
        </span>
      )}

      {user.psnName && (
        <span className="inline-flex gap-1">
          <PlayStationIcon className="inline size-5" />
          <span className="font-semibold">PlayStation:</span>
          <span>{user.psnName}</span>
        </span>
      )}
    </div>
  );
};

const ClickableClubTag = ({ clubTag }: { clubTag: string }) => {
  const navigate = useNavigate({ from: "/" });

  return (
    <button
      className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
      title="View club ranking"
      onClick={() => {
        navigate({
          search: (prev) => ({
            ...prev,
            panel: panels.CLUBS,
            clubTag: `exactCt:${clubTag}`,
          }),
        });
      }}
    >
      {clubTag}
    </button>
  );
};
