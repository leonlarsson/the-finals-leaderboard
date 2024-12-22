import {
  BlueskyIcon,
  CrossplayIcon,
  GitHubIcon,
  PlayStationIcon,
  SteamIcon,
  XTwitterIcon,
} from "@/components/icons";
import BasicLink from "@/components/Link";
import { ClubsStatsPanel } from "@/components/panels/ClubsStatsPanel";
import { LeaderboardStatsPanel } from "@/components/panels/LeaderboardStatsPanel";
import { LeaderboardDataTable } from "@/components/tables/LeaderboardDataTable";
import { leaderboardDataTableColumns } from "@/components/tables/LeaderboardDataTableColumns";
import ThemeToggle from "@/components/ThemeToggle";
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
import { createFileRoute } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import {
  BarChartIcon,
  HomeIcon,
  Loader2Icon,
  RefreshCwIcon,
  TrophyIcon,
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

  // This is safe because lbParam is validated above
  const leaderboard = Object.values(leaderboards).find(
    (x) => x.id === lbParam,
  )!;

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
    <div className="my-4 flex flex-col gap-5">
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
              <SelectTrigger className="w-max select-none">
                {leaderboard.group !== group ? (
                  group === "select1" ? (
                    "Season 5 Leaderboards"
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
            <TabsList>
              {[
                {
                  leaderboardPlatform: platforms.CROSSPLAY,
                  title: "Crossplay",
                  icon: <CrossplayIcon className="inline size-5" />,
                },
                {
                  leaderboardPlatform: platforms.STEAM,
                  title: "Steam",
                  icon: <SteamIcon className="inline size-5" />,
                },
                {
                  leaderboardPlatform: platforms.XBOX,
                  title: "Xbox",
                  icon: <XboxIcon className="inline size-5" />,
                },
                {
                  leaderboardPlatform: platforms.PSN,
                  title: "PlayStation",
                  icon: <PlayStationIcon className="inline size-5" />,
                },
              ].map(({ leaderboardPlatform: value, icon }) => (
                <TabsTrigger
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

        <TooltipProvider disableHoverableContent>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="select-none"
                onClick={() =>
                  queryClient.invalidateQueries({
                    predicate: (query) => query.queryKey[0] !== "notice",
                  })
                }
                disabled={loadingOrRefetching}
              >
                <span className="mr-2 hidden min-[400px]:block">Refresh</span>

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
            <div>
              <div className="text-lg">
                An error happened. Please contact the developer on{" "}
                <BasicLink href="https://bsky.app/profile/leon.ms">
                  Bluesky
                </BasicLink>
                , <BasicLink href="https://x.com/mozzyfx">Twitter</BasicLink> or{" "}
                <BasicLink href={githubLink.href}>
                  file an issue on GitHub
                </BasicLink>{" "}
                if this error persists.
              </div>

              {error && (
                <div className="mt-3">
                  <div className="font-medium">
                    Useful information to include:
                  </div>
                  <pre className="overflow-x-auto rounded bg-neutral-100 p-2 dark:bg-neutral-900">
                    {error.stack}
                  </pre>
                </div>
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

      <div className="mt-10 flex flex-col gap-2">
        <span>
          Current data updated at{" "}
          {loadingOrRefetching ? (
            <Loader2Icon className="inline size-5 animate-spin" />
          ) : (
            new Date(dataUpdatedAt).toLocaleString()
          )}
        </span>

        <span className="text-sm">
          This site is not affiliated with{" "}
          <BasicLink href="https://www.embark-studios.com/">
            Embark Studios
          </BasicLink>
          . All imagery and data is owned by{" "}
          <BasicLink href="https://www.embark-studios.com/">
            Embark Studios
          </BasicLink>
          . Created by{" "}
          <BasicLink href="https://bsky.app/profile/leon.ms">Mozzy</BasicLink>.
          Check out the{" "}
          <BasicLink href="https://github.com/leonlarsson/the-finals-api">
            API
          </BasicLink>
          .
        </span>

        <div className="flex gap-2">
          <ThemeToggle />
          <BasicLink href="https://bsky.app/profile/leon.ms">
            <Button variant="outline" size="icon">
              <BlueskyIcon className="size-5" />
            </Button>
          </BasicLink>

          <BasicLink href="https://x.com/mozzyfx">
            <Button variant="outline" size="icon">
              <XTwitterIcon className="size-5" />
            </Button>
          </BasicLink>

          <BasicLink href="https://github.com/leonlarsson/the-finals-leaderboard">
            <Button variant="outline" size="icon">
              <GitHubIcon className="size-5" />
            </Button>
          </BasicLink>
        </div>
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
