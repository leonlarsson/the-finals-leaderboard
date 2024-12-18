import "./index.css";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  BarChartIcon,
  HomeIcon,
  Loader2Icon,
  RefreshCwIcon,
  TrophyIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Notice } from "./components/Notice";
import CommunityProgress from "./components/CommunityProgress";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/TableColumns";
import { Button } from "./components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import Stats from "./components/Stats";
import ThemeToggle from "./components/ThemeToggle";
import Icons from "./components/icons";
import Link from "./components/Link";
import { cn } from "./lib/utils";
import { LeaderboardFeature, Panels, Platforms } from "./types";
import { fetchData } from "./utils/fetchData";
import { communityEvents } from "./utils/communityEvents";
import {
  Leaderboard,
  LeaderboardId,
  defaultLeaderboardId,
  leaderboardIdsToPrefetch,
  leaderboards,
} from "./utils/leaderboards";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { ClubStatsPanel } from "./components/ClubStatsPanel";

const App = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const leaderboardSearchParam = searchParams.get("leaderboard");
  const platformSearchParam = searchParams.get("platform");
  const panelSearchParam = searchParams.get("panel");

  // Set the initial leaderboard version to the query param if:
  // - The query param is set
  // - The query param is a valid leaderboard version
  // - The leaderboard version is enabled
  // Otherwise, use the default leaderboard version
  const initialLeaderboardVersion =
    leaderboardSearchParam &&
    Object.keys(leaderboards).includes(
      leaderboardSearchParam as LeaderboardId,
    ) &&
    leaderboards[leaderboardSearchParam as LeaderboardId].enabled
      ? leaderboardSearchParam
      : defaultLeaderboardId;

  // Set the initial platform to the query param if:
  // - The query param is set
  // - The query param is a valid platform
  // Otherwise, use the default platform (Crossplay)
  const initialPlatform =
    platformSearchParam &&
    Object.values(Platforms).includes(platformSearchParam as Platforms)
      ? platformSearchParam
      : Platforms.Crossplay;

  const [selectedLeaderboardVersion, setSelectedLeaderboardVersion] =
    useState<LeaderboardId>(initialLeaderboardVersion as LeaderboardId);

  const panelToFeatureMap: Record<string, LeaderboardFeature> = {
    stats: "statsPanel",
    clubs: "clubsPanel",
  };

  function isValidPanel(panel: string, leaderboardVersion: string): boolean {
    const feature = panelToFeatureMap[panel];
    return (
      feature !== undefined &&
      leaderboards[leaderboardVersion].features.includes(feature)
    );
  }

  // Set the initial panel to the query param if:
  // - The query param is set
  // - The query param is a valid panel
  // - The panel is available for the selected leaderboard version
  // Otherwise, use the default panel (Leaderboard)
  const initialPanel =
    panelSearchParam &&
    isValidPanel(panelSearchParam, selectedLeaderboardVersion)
      ? panelSearchParam
      : Panels.Leaderboard;

  const [selectedPlatform, setSelectedPlatform] = useState<Platforms>(
    initialPlatform as Platforms,
  );

  const [selectedPanel, setSelectedPanel] = useState<Panels>(
    initialPanel as Panels,
  );

  const queryClient = useQueryClient();

  // Use TanStack Query to fetch data
  // This will cache all combinations of leaderboard version and platform infinitely
  // Or until the page is refreshed or the cache is invalidated (refresh button is pressed)
  const { isLoading, data, isError, error, dataUpdatedAt, isRefetching } =
    useQuery({
      queryKey: ["leaderboard", selectedLeaderboardVersion, selectedPlatform],
      queryFn: () => fetchData(selectedLeaderboardVersion, selectedPlatform),
      staleTime: Infinity, // Cache the data until the page is refreshed
    });

  // Prefetch data for the other leaderboard version and platform
  // User when hovering over the tabs
  // Defaults to the current selected values in state, but can be overridden
  const prefetchData = ({
    leaderboard,
    platform,
  }: {
    leaderboard?: LeaderboardId;
    platform?: Platforms;
  }) => {
    queryClient.prefetchQuery({
      queryKey: [
        "leaderboard",
        leaderboard ?? selectedLeaderboardVersion,
        platform ?? selectedPlatform,
      ],
      queryFn: () =>
        fetchData(
          leaderboard ?? selectedLeaderboardVersion,
          platform ?? selectedPlatform,
        ),
      staleTime: Infinity,
    });
  };

  // On initial render, prefetch data for select leaderboards
  useEffect(() => {
    leaderboardIdsToPrefetch.forEach((leaderboard) =>
      prefetchData({ leaderboard }),
    );
  }, []);

  // Store selected leaderboard version and platform in URL
  // Perhaps not the best way to do it, but it works
  // Remove the query param if it's the default values
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    selectedLeaderboardVersion === defaultLeaderboardId
      ? searchParams.delete("leaderboard")
      : searchParams.set("leaderboard", selectedLeaderboardVersion);

    selectedPlatform === Platforms.Crossplay
      ? searchParams.delete("platform")
      : searchParams.set("platform", selectedPlatform);

    selectedPanel === Panels.Leaderboard
      ? searchParams.delete("panel")
      : searchParams.set("panel", selectedPanel);

    window.history.replaceState(
      null,
      "",
      searchParams.size > 0 ? `?${searchParams.toString()}` : "/",
    );
  }, [selectedLeaderboardVersion, selectedPlatform, selectedPanel]);

  const updateSelectedLeaderboard = (leaderboard: LeaderboardId) => {
    // Switch to Leaderboard panel if the currently selected panel is not available for the new leaderboard
    if (
      (!leaderboards[leaderboard].features.includes("statsPanel") &&
        selectedPanel === Panels.Stats) ||
      (!leaderboards[leaderboard].features.includes("clubsPanel") &&
        selectedPanel === Panels.Clubs)
    ) {
      setSelectedPanel(Panels.Leaderboard);
    }
    setSelectedLeaderboardVersion(leaderboard);
  };

  const renderTabsListByGroup = (group: Leaderboard["group"]) => {
    const leaderboardsByGroup = Object.values(leaderboards).filter(
      (x) => x.group === group && x.enabled,
    );

    if (!leaderboardsByGroup.length) return null;

    return (
      <TabsList>
        {leaderboardsByGroup.map((leaderboard: Leaderboard) => (
          <TabsTrigger
            key={leaderboard.id}
            value={leaderboard.id}
            onPointerEnter={() =>
              prefetchData({
                leaderboard: leaderboard.id as LeaderboardId,
              })
            }
          >
            <span className="hidden items-center gap-1 min-[400px]:flex">
              {leaderboard.tabIcon} {leaderboard.name}
            </span>
            <span className="flex items-center gap-1 min-[400px]:hidden">
              {leaderboard.tabIcon} {leaderboard.nameShort}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    );
  };

  const loadingOrRefetching = isLoading || isRefetching;

  return (
    <div className="container mb-12 mt-2 font-saira max-sm:px-2">
      <h1 className="text-2xl font-medium sm:text-3xl">
        Enhanced Leaderboard – THE FINALS
      </h1>

      <h5>
        Select a leaderboard and platform to view the current standings.{" "}
        <button
          id="share-button"
          title="Copy link to clipboard"
          className="w-40 text-left font-semibold hover:underline"
          onClick={() => {
            const shareData = {
              title: document.title,
              text: "Check out the Enhanced Leaderboard for THE FINALS!",
              url: "https://the-finals-leaderboard.com",
            };

            if (
              typeof navigator.canShare === "function" &&
              navigator.canShare(shareData)
            ) {
              navigator.share(shareData);
            } else {
              navigator.clipboard.writeText(shareData.url).then(() => {
                const button = document.getElementById(
                  "share-button",
                ) as HTMLButtonElement;
                button.textContent = "Link copied!";
                button.disabled = true;
                setTimeout(() => {
                  button.textContent = "Share this website!";
                  button.disabled = false;
                }, 1500);
              });
            }
          }}
        >
          Share this website!
        </button>
      </h5>

      <Notice />

      <div className="my-2">
        <CommunityProgress
          eventData={Object.values(communityEvents).find((x) => x.active)}
        />
      </div>

      <div className="my-4 flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <div className="block w-full min-[400px]:hidden">
            Leaderboard:{" "}
            <span className="font-medium">
              {leaderboards[selectedLeaderboardVersion].name}
            </span>
          </div>

          {/* Leaderboards in groups tabGroup1, tabGroup2 */}
          {Object.values(leaderboards).filter(
            (x) =>
              // @ts-ignore This may not exist at the moment, but it can
              x.enabled && (x.group === "tabGroup1" || x.group === "tabGroup2"),
          ).length > 0 && (
            <Tabs
              className="flex select-none flex-wrap gap-2"
              value={selectedLeaderboardVersion}
              onValueChange={(e) =>
                updateSelectedLeaderboard(e as LeaderboardId)
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
                value={selectedLeaderboardVersion}
                onValueChange={(e) =>
                  updateSelectedLeaderboard(e as LeaderboardId)
                }
              >
                <SelectTrigger className="w-max select-none">
                  {leaderboards[selectedLeaderboardVersion].group !== group ? (
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
                              leaderboard: leaderboard.id as LeaderboardId,
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
          {leaderboards[selectedLeaderboardVersion].features.includes(
            "platformSelection",
          ) && (
            <Tabs
              className="select-none"
              defaultValue={selectedPlatform}
              onValueChange={(e) => setSelectedPlatform(e as Platforms)}
            >
              <TabsList>
                {[
                  {
                    leaderboardPlatform: Platforms.Crossplay,
                    title: "Crossplay",
                    icon: <Icons.crossplay className="inline size-5" />,
                  },
                  {
                    leaderboardPlatform: Platforms.Steam,
                    title: "Steam",
                    icon: <Icons.steam className="inline size-5" />,
                  },
                  {
                    leaderboardPlatform: Platforms.Xbox,
                    title: "Xbox",
                    icon: <Icons.xbox className="inline size-5" />,
                  },
                  {
                    leaderboardPlatform: Platforms.PSN,
                    title: "PlayStation",
                    icon: <Icons.playstation className="inline size-5" />,
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
                  <Link href="https://bsky.app/profile/leon.ms">Bluesky</Link>,{" "}
                  <Link href="https://x.com/mozzyfx">Twitter</Link> or{" "}
                  <Link href={githubLink.href}>file an issue on GitHub</Link> if
                  this error persists.
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
              value={selectedPanel}
              onValueChange={(v) => setSelectedPanel(v as Panels)}
            >
              <TabsList>
                <TabsTrigger
                  value={Panels.Leaderboard}
                  disabled={loadingOrRefetching}
                >
                  <TrophyIcon className="mr-2 inline size-5" />
                  Leaderboard
                </TabsTrigger>

                <TabsTrigger
                  value={Panels.Stats}
                  disabled={
                    loadingOrRefetching ||
                    !leaderboards[selectedLeaderboardVersion].features.includes(
                      "statsPanel",
                    )
                  }
                >
                  <BarChartIcon className="mr-2 inline size-5" />
                  Stats
                </TabsTrigger>
                <TabsTrigger
                  value={Panels.Clubs}
                  disabled={
                    loadingOrRefetching ||
                    !leaderboards[selectedLeaderboardVersion].features.includes(
                      "clubsPanel",
                    )
                  }
                >
                  <HomeIcon className="mr-2 inline size-5" />
                  Clubs
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {selectedPanel === Panels.Leaderboard && (
              <DataTable
                key={selectedLeaderboardVersion}
                leaderboardVersion={selectedLeaderboardVersion}
                queryState={{ isLoading, isRefetching }}
                // https://github.com/TanStack/table/issues/4382#issuecomment-2081153305
                columns={(
                  columns(
                    selectedLeaderboardVersion,
                    selectedPlatform,
                  ) as ColumnDef<unknown>[]
                ).filter((col) =>
                  leaderboards[
                    selectedLeaderboardVersion
                    // @ts-ignore This does exist because I create it
                  ].tableColumns.includes(col.id),
                )}
                data={data ?? []}
              />
            )}

            {selectedPanel === Panels.Stats && (
              <Stats
                leaderboardVersion={selectedLeaderboardVersion}
                platform={selectedPlatform}
                users={data ?? []}
              />
            )}

            {selectedPanel === Panels.Clubs && (
              <ClubStatsPanel
                leaderboardVersion={selectedLeaderboardVersion}
                platform={selectedPlatform}
                users={data ?? []}
              />
            )}
          </div>
        )}
      </div>

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
          <Link href="https://www.embark-studios.com/">Embark Studios</Link>.
          All imagery and data is owned by{" "}
          <Link href="https://www.embark-studios.com/">Embark Studios</Link>.
          Created by <Link href="https://bsky.app/profile/leon.ms">Mozzy</Link>.
          Check out the{" "}
          <Link href="https://github.com/leonlarsson/the-finals-api">API</Link>.
        </span>

        <div className="flex gap-2">
          <ThemeToggle />
          <Link href="https://bsky.app/profile/leon.ms">
            <Button variant="outline" size="icon">
              <Icons.bluesky className="size-5" />
            </Button>
          </Link>

          <Link href="https://x.com/mozzyfx">
            <Button variant="outline" size="icon">
              <Icons.xTwitter className="size-5" />
            </Button>
          </Link>

          <Link href="https://github.com/leonlarsson/the-finals-leaderboard">
            <Button variant="outline" size="icon">
              <Icons.github className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;
