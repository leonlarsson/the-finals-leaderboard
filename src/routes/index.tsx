import { CrossplayIcon, PlayStationIcon, SteamIcon } from "@/components/icons";
import BasicLink from "@/components/Link";
import { ClubsStatsPanel } from "@/components/panels/ClubsStatsPanel";
import { LeaderboardStatsPanel } from "@/components/panels/LeaderboardStatsPanel";
import { LeaderboardDataTable } from "@/components/tables/LeaderboardDataTable";
import { leaderboardDataTableColumns } from "@/components/tables/LeaderboardDataTableColumns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LeaderboardFeature, panels, platforms } from "@/types";
import { fetchData } from "@/utils/fetchData";
import {
  defaultLeaderboardId,
  Leaderboard,
  LeaderboardId,
  leaderboardIdsToPrefetch,
  leaderboards,
} from "@/utils/leaderboards";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HOUR, MINUTE } from "@/utils/time";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import {
  BarChartIcon,
  ExternalLinkIcon,
  HomeIcon,
  Loader2Icon,
  RefreshCwIcon,
  StarIcon,
  TrophyIcon,
  UserRoundIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { XboxIcon } from "@/components/icons";

const searchParamsSchema = z.object({
  lb: z
    .enum(Object.values(leaderboards).map((x) => x.id) as [string, ...string[]])
    .optional(),
  panel: z.enum(Object.values(panels) as [string, ...string[]]).optional(),
  platform: z
    .enum(Object.values(platforms) as [string, ...string[]])
    .optional(),
  name: z.string().optional(),
  clubTag: z.string().optional(),
  leagues: z.string().array().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const {
    lb: lbParam,
    panel: panelParam,
    platform: platformParam,
  } = Route.useSearch({
    select: ({ lb, panel, platform }) => ({
      lb: (lb && lb in leaderboards
        ? lb
        : defaultLeaderboardId) as LeaderboardId,
      panel: panel ?? panels.LEADERBOARD,
      platform: platform ?? platforms.CROSSPLAY,
    }),
  });
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const { favorites, toggleFavorite } = useFavorites();
  const { clubFavorites, toggleClubFavorite } = useClubFavorites();

  // This is safe because lbParam is validated above
  const leaderboard = Object.values(leaderboards).find(
    (x) => x.id === lbParam,
  )!;

  useEffect(() => {
    document.title = `${leaderboard.name} · Enhanced Leaderboard – THE FINALS`;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [leaderboard.name]);

  // Use TanStack Query to fetch data
  // This will cache all combinations of leaderboard version and platform infinitely
  // Or until the page is refreshed or the cache is invalidated (refresh button is pressed)
  const { isLoading, data, isError, error, dataUpdatedAt, isRefetching } =
    useQuery({
      queryKey: ["leaderboard", lbParam, platformParam],
      queryFn: () => fetchData(lbParam, platformParam),
      staleTime: Infinity, // Cache the data until the page is refreshed
    });

  // Prefetch data for the other leaderboard version and platform
  // User when hovering over the tabs
  // Defaults to the current selected values in state, but can be overridden
  const prefetchData = ({
    leaderboardId,
    platform,
  }: {
    leaderboardId?: LeaderboardId;
    platform?: string;
  }) => {
    queryClient.prefetchQuery({
      queryKey: [
        "leaderboard",
        leaderboardId ?? lbParam,
        platform ?? platformParam,
      ],
      queryFn: () =>
        fetchData(leaderboardId ?? lbParam, platform ?? platformParam),
      staleTime: Infinity,
    });
  };

  // On initial render, prefetch data for select leaderboards
  useEffect(() => {
    leaderboardIdsToPrefetch.forEach((leaderboardId) =>
      prefetchData({ leaderboardId }),
    );
  }, []);

  // Performs cleanup of search params based on the new leaderboard
  const setLeaderboard = (newLeaderboardId: LeaderboardId) => {
    const newLeaderboard = leaderboards[newLeaderboardId];
    // If new leaderboard doesn't support the current panel, set panel to leaderboard
    navigate({
      search: (prev) => ({
        lb:
          newLeaderboardId === defaultLeaderboardId
            ? undefined
            : newLeaderboardId,
        panel: isValidPanel(panelParam, newLeaderboardId)
          ? panelParam
          : undefined,
        name: prev.name,
        clubTag: newLeaderboard.features.includes("clubsPanel")
          ? prev.clubTag
          : undefined,
        platform: newLeaderboard.features.includes("platformSelection")
          ? prev.platform
          : undefined,
      }),
    });
  };

  const renderTabsListByGroup = (group: Leaderboard["group"]) => {
    const leaderboardsByGroup = Object.values(leaderboards).filter(
      (x) => x.group === group && x.enabled,
    );

    if (!leaderboardsByGroup.length) return null;

    return (
      <TabsList>
        {leaderboardsByGroup.map((leaderboardToRender: Leaderboard) => (
          <TabsTrigger
            key={leaderboardToRender.id}
            value={leaderboardToRender.id}
            onPointerEnter={() =>
              prefetchData({
                leaderboardId: leaderboardToRender.id as LeaderboardId,
              })
            }
          >
            <span className="hidden items-center gap-1 min-[400px]:flex">
              {leaderboardToRender.tabIcon} {leaderboardToRender.name}
            </span>
            <span className="flex items-center gap-1 min-[400px]:hidden">
              {leaderboardToRender.tabIcon} {leaderboardToRender.nameShort}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    );
  };

  const loadingOrRefetching = isLoading || isRefetching;

  return (
    <div className="mb-1 mt-4 flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <div className="block w-full min-[400px]:hidden">
          Leaderboard: <span className="font-medium">{leaderboard.name}</span>
        </div>

        {/* Leaderboards in groups tabGroup1, tabGroup2 */}
        {Object.values(leaderboards).filter(
          (x) =>
            // @ts-ignore This may not exist at the moment, but it can
            x.enabled && (x.group === "tabGroup1" || x.group === "tabGroup2"),
        ).length > 0 && (
          <Tabs
            className="flex select-none flex-wrap gap-2"
            value={lbParam}
            onValueChange={(e) =>
              navigate({
                params: { leaderboard: e },
              })
            }
          >
            {renderTabsListByGroup("tabGroup1")}
            {renderTabsListByGroup("tabGroup2")}
          </Tabs>
        )}

        {/* Leaderboards in groups select1, select2 */}
        {(["select1", "select2"] as const).map((group) => {
          if (
            Object.values(leaderboards).filter(
              (x) => x.group === group && x.enabled,
            ).length === 0
          ) {
            return null;
          }

          return (
            <Select
              key={group}
              value={lbParam}
              onValueChange={(e) => setLeaderboard(e as LeaderboardId)}
            >
              <SelectTrigger className="h-9 w-max select-none">
                {leaderboard.group !== group ? (
                  group === "select1" ? (
                    `Season ${defaultLeaderboardId.match(/(\d{1})/)?.[0] ?? "7"} Leaderboards`
                  ) : (
                    "Older Leaderboards"
                  )
                ) : (
                  <span className="font-medium">
                    <SelectValue />
                  </span>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.values(leaderboards)
                    .filter((x) => x.group === group)
                    .filter((x) => x.enabled)
                    .map((leaderboard) => (
                      <SelectItem
                        key={leaderboard.id}
                        value={leaderboard.id}
                        disabled={!leaderboard.enabled}
                        onPointerEnter={() =>
                          prefetchData({
                            leaderboardId: leaderboard.id as LeaderboardId,
                          })
                        }
                      >
                        {leaderboard.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        })}

        {/* LEADERBOARD PLATFORM */}
        {leaderboard.features.includes("platformSelection") && (
          <Tabs
            className="select-none"
            defaultValue={platformParam}
            onValueChange={(newPlatform) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  platform:
                    newPlatform === "crossplay"
                      ? undefined
                      : (newPlatform as "crossplay" | "steam" | "psn" | "xbox"),
                }),
              });
            }}
          >
            <TabsList className="h-9">
              {[
                {
                  leaderboardPlatform: platforms.CROSSPLAY,
                  title: "Crossplay",
                  icon: <CrossplayIcon className="inline size-[18px]" />,
                },
                {
                  leaderboardPlatform: platforms.STEAM,
                  title: "Steam",
                  icon: <SteamIcon className="inline size-[18px]" />,
                },
                {
                  leaderboardPlatform: platforms.XBOX,
                  title: "Xbox",
                  icon: <XboxIcon className="inline size-[18px]" />,
                },
                {
                  leaderboardPlatform: platforms.PSN,
                  title: "PlayStation",
                  icon: <PlayStationIcon className="inline size-[18px]" />,
                },
              ].map(({ leaderboardPlatform: value, icon }) => (
                <TabsTrigger
                  // className="h-full w-8 p-0"
                  key={value}
                  value={value}
                  onPointerEnter={() => prefetchData({ platform: value })}
                >
                  {icon}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Player Search */}
        <Button
          size="sm"
          variant="outline"
          className="select-none gap-1.5"
          asChild
        >
          <Link to="/players">
            <UserRoundIcon className="size-4" />
            <span className="hidden min-[400px]:block">Players</span>
          </Link>
        </Button>

        {/* Club Search */}
        <Button
          size="sm"
          variant="outline"
          className="select-none gap-1.5"
          asChild
        >
          <Link to="/clubs">
            <UsersRoundIcon className="size-4" />
            <span className="hidden min-[400px]:block">Clubs</span>
          </Link>
        </Button>

        {/* Favorites popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="select-none gap-1.5">
              <StarIcon className="size-4" />
              <span className="hidden min-[400px]:block">Favorites</span>
              {(favorites.length > 0 || clubFavorites.length > 0) && (
                <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-xs font-medium leading-none dark:bg-neutral-700">
                  {favorites.length + clubFavorites.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2 font-saira">
            {favorites.length === 0 && clubFavorites.length === 0 ? (
              <p className="px-2 py-1.5 text-sm text-neutral-500">
                No favorites yet. Open a player or club profile and click{" "}
                <StarIcon className="inline size-3" /> to save them here.
              </p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {favorites.length > 0 && (
                  <>
                    <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Saved Players
                    </p>
                    {favorites.map((name) => (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-1 rounded px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Link
                          to="/players/$playerName"
                          params={{ playerName: name }}
                          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm"
                        >
                          <UserRoundIcon className="size-3.5 shrink-0 text-neutral-400" />
                          <span className="truncate">{name}</span>
                        </Link>
                        <button
                          onClick={() => toggleFavorite(name)}
                          className="shrink-0 text-neutral-400 hover:text-red-500"
                          title="Remove"
                        >
                          <XIcon className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                {clubFavorites.length > 0 && (
                  <>
                    <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Saved Clubs
                    </p>
                    {clubFavorites.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between gap-1 rounded px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Link
                          to="/clubs/$clubTag"
                          params={{ clubTag: tag }}
                          className="flex min-w-0 flex-1 items-center gap-1.5 text-sm"
                        >
                          <UsersRoundIcon className="size-3.5 shrink-0 text-neutral-400" />
                          <span className="truncate">[{tag}]</span>
                        </Link>
                        <button
                          onClick={() => toggleClubFavorite(tag)}
                          className="shrink-0 text-neutral-400 hover:text-red-500"
                          title="Remove"
                        >
                          <XIcon className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </>
                )}
                <div className="mt-1 border-t border-neutral-200 pt-1 dark:border-neutral-700">
                  <Link
                    to="/favorites"
                    className="flex items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  >
                    <ExternalLinkIcon className="size-3.5" />
                    View dashboard
                  </Link>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <TooltipProvider disableHoverableContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="select-none"
                onClick={() =>
                  queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] !== "notice",
                  })
                }
                disabled={loadingOrRefetching}
              >
                <span className="hidden min-[400px]:block">Refresh</span>

                <RefreshCwIcon
                  className={cn(
                    "size-4",
                    loadingOrRefetching && "animate-spin",
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh data.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {isError &&
        (() => {
          const githubLink = new URL(
            "https://github.com/leonlarsson/the-finals-leaderboard/issues/new",
          );
          githubLink.searchParams.set(
            "title",
            error.message || "Error encountered",
          );
          githubLink.searchParams.set(
            "body",
            error.stack
              ? `I encountered the following error on ${location.href}\n\`\`\`\n${error.stack}\n\`\`\``
              : "I encountered an error.",
          );

          return (
            <div className="flex flex-col items-start gap-3">
              <span className="text-lg font-medium text-red-500">
                Failed to load data
              </span>
              <p className="text-neutral-600 dark:text-neutral-400">
                An error happened. Please contact the developer on{" "}
                <BasicLink href="https://x.com/mozzyfx">Twitter</BasicLink>,{" "}
                <BasicLink href="https://bsky.app/profile/leon.ms">
                  Bluesky
                </BasicLink>{" "}
                or{" "}
                <BasicLink href={githubLink.href}>
                  file an issue on GitHub
                </BasicLink>{" "}
                if this error persists.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] !== "notice",
                  })
                }
              >
                Try again
              </Button>
              {error && (
                <details className="w-full">
                  <summary className="cursor-pointer text-sm font-medium text-neutral-500">
                    Error details
                  </summary>
                  <pre className="mt-2 overflow-x-auto rounded bg-neutral-100 p-2 text-xs dark:bg-neutral-900">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          );
        })()}

      {/* Panel selector and panels */}
      {!isError && (
        <div className="space-y-3">
          <Tabs
            className="select-none"
            value={panelParam}
            onValueChange={(tab) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  panel: tab === panels.LEADERBOARD ? undefined : tab,
                }),
              });
            }}
          >
            <TabsList>
              <TabsTrigger
                value={panels.LEADERBOARD}
                disabled={loadingOrRefetching}
              >
                <TrophyIcon className="mr-2 inline size-5" />
                Leaderboard
              </TabsTrigger>

              <TabsTrigger
                value={panels.STATS}
                disabled={
                  loadingOrRefetching ||
                  !leaderboard.features.includes("statsPanel")
                }
              >
                <BarChartIcon className="mr-2 inline size-5" />
                Stats
              </TabsTrigger>
              <TabsTrigger
                value={panels.CLUBS}
                disabled={
                  loadingOrRefetching ||
                  !leaderboard.features.includes("clubsPanel")
                }
              >
                <HomeIcon className="mr-2 inline size-5" />
                Clubs
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {panelParam === panels.LEADERBOARD && (
            <LeaderboardDataTable
              key={lbParam}
              leaderboardId={lbParam}
              queryState={{ isLoading, isRefetching }}
              // https://github.com/TanStack/table/issues/4382#issuecomment-2081153305
              columns={(
                leaderboardDataTableColumns(
                  lbParam,
                  platformParam,
                ) as ColumnDef<unknown>[]
              ).filter((col) =>
                // @ts-ignore This does exist because I create it
                leaderboard.tableColumns.includes(col.id),
              )}
              data={data ?? []}
            />
          )}

          {panelParam === panels.STATS && (
            <LeaderboardStatsPanel
              leaderboardVersion={lbParam}
              platform={platformParam}
              users={data ?? []}
            />
          )}

          {panelParam === panels.CLUBS && (
            <ClubsStatsPanel
              leaderboardVersion={lbParam}
              platform={platformParam}
              users={data ?? []}
              isLoading={isLoading}
              isRefetching={isRefetching}
            />
          )}
        </div>
      )}

      <div className="mt-10 flex items-center gap-2 text-sm text-neutral-500">
        {loadingOrRefetching ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            <span>Updating...</span>
          </>
        ) : isError ? (
          <>
            <span className="size-2 rounded-full bg-red-500" />
            <span>Error loading data</span>
          </>
        ) : (
          <>
            <span className="size-2 rounded-full bg-green-500" />
            <span>
              Live · Updated{" "}
              {dataUpdatedAt === 0
                ? "never"
                : Date.now() - dataUpdatedAt < MINUTE
                  ? "just now"
                  : Date.now() - dataUpdatedAt < HOUR
                    ? `${Math.floor((Date.now() - dataUpdatedAt) / MINUTE)}m ago`
                    : `${Math.floor((Date.now() - dataUpdatedAt) / HOUR)}h ago`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

const panelToFeatureMap: Record<string, LeaderboardFeature> = {
  stats: "statsPanel",
  clubs: "clubsPanel",
};

/** Returns true if the given panel is supported in the given leaderboard. */
function isValidPanel(
  panel: string,
  leaderboardVersion: LeaderboardId,
): boolean {
  const feature = panelToFeatureMap[panel];
  return (
    feature !== undefined &&
    leaderboards[leaderboardVersion].features.includes(feature)
  );
}
