import "./index.css";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChartIcon, Loader, RefreshCw, TableIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Panels, Platforms } from "./types";
import { fetchData } from "./utils/fetchData";
import { communityEvents } from "./utils/communityEvents";
import { LeaderboardId, leaderboards } from "./utils/leaderboards";
import { ColumnDef } from "@tanstack/react-table";

const App = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const leaderboardSearchParam = searchParams.get("leaderboard");
  const platformSearchParam = searchParams.get("platform");
  const panelSearchParam = searchParams.get("panel");

  const initialLeaderboardVersion =
    leaderboardSearchParam &&
    Object.keys(leaderboards).includes(leaderboardSearchParam as LeaderboardId)
      ? leaderboardSearchParam
      : leaderboards.season2.id;

  const initialPlatform =
    platformSearchParam &&
    Object.values(Platforms).includes(platformSearchParam as Platforms)
      ? platformSearchParam
      : Platforms.Crossplay;

  const [selectedLeaderboardVersion, setSelectedLeaderboardVersion] =
    useState<LeaderboardId>(initialLeaderboardVersion as LeaderboardId);

  // Set the initial panel to Stats if the panel query param is set to Stats
  // and the Stats panel is not disabled
  const initialPanel =
    panelSearchParam &&
    Object.values(Panels).includes(panelSearchParam as Panels) &&
    !leaderboards[selectedLeaderboardVersion].disableStatsPanel
      ? panelSearchParam
      : Panels.Table;

  const [selectedPlatform, setSelectedPlatform] = useState<Platforms>(
    initialPlatform as Platforms,
  );

  const [selectedPanel, setSelectedPanel] = useState<Panels>(
    initialPanel as Panels,
  );

  const queryClient = useQueryClient();

  // Use TanStack Query to fetch data
  // This will cache all cpmbinations of leaderboard version and platform infinitely
  // Or until the page is refreshed or the cache is invalidated (refresh button is pressed)
  const { isLoading, data, error, dataUpdatedAt, isRefetching } = useQuery({
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

  // Store selected leaderboard version and platform in URL
  // Perhaps not the best way to do it, but it works
  // Remove the query param if it's the default values
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    selectedLeaderboardVersion === "season2"
      ? searchParams.delete("leaderboard")
      : searchParams.set("leaderboard", selectedLeaderboardVersion);

    selectedPlatform === Platforms.Crossplay
      ? searchParams.delete("platform")
      : searchParams.set("platform", selectedPlatform);

    selectedPanel === Panels.Table
      ? searchParams.delete("panel")
      : searchParams.set("panel", selectedPanel);

    window.history.replaceState(
      null,
      "",
      searchParams.size > 0 ? `?${searchParams.toString()}` : "/",
    );
  }, [selectedLeaderboardVersion, selectedPlatform, selectedPanel]);

  const disabled = isLoading || isRefetching;

  return (
    <div className="container mb-12 font-saira max-sm:px-2">
      <h1 className="text-2xl font-medium underline sm:text-4xl">
        Enhanced Leaderboard – THE FINALS
      </h1>
      <h5 className="text-base sm:text-xl">
        View leaderboards from THE FINALS and track your progress.
      </h5>

      <CommunityProgress
        enabled={false}
        eventData={communityEvents.april2024PushThePlatform}
      />

      {/* Notice */}
      {/* <div className="my-1 flex items-center gap-2 rounded-md bg-brand-purple p-1 text-white">
        <Icon className="size-5 flex-shrink-0" />
        <span>Text</span>
      </div> */}

      <div className="my-4 flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {/* LEADERBOARD VERSION */}

          {/* Special leaderboards */}
          <Tabs
            className="flex flex-wrap gap-2"
            value={selectedLeaderboardVersion}
            onValueChange={e => {
              // Switch to Table panel if the Stats panel is disabled
              if (
                leaderboards[e as LeaderboardId].disableStatsPanel &&
                selectedPanel === Panels.Stats
              ) {
                setSelectedPanel(Panels.Table);
              }
              setSelectedLeaderboardVersion(e as LeaderboardId);
            }}
          >
            <TabsList>
              {[leaderboards.eventTerminalAttack].map(
                ({ id, name, nameShort, tabIcon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    onPointerEnter={() => prefetchData({ leaderboard: id })}
                  >
                    <span className="hidden items-center gap-1 min-[530px]:flex">
                      {tabIcon} {name}
                    </span>
                    <span className="block min-[530px]:hidden">
                      {nameShort}
                    </span>
                  </TabsTrigger>
                ),
              )}
            </TabsList>

            {/* Regular leaderboards */}
            <TabsList>
              {[
                leaderboards.season2,
                leaderboards.season1,
                leaderboards.openBeta,
                leaderboards.closedBeta2,
                leaderboards.closedBeta1,
              ].map(({ id, name, nameShort, tabIcon }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  onPointerEnter={() => prefetchData({ leaderboard: id })}
                >
                  <span className="hidden items-center gap-1 min-[530px]:flex">
                    {tabIcon} {name}
                  </span>
                  <span className="block min-[530px]:hidden">{nameShort}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* LEADERBOARD PLATFORM */}
          <Tabs
            defaultValue={selectedPlatform}
            onValueChange={e => setSelectedPlatform(e as Platforms)}
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
                  disabled={
                    disabled ||
                    leaderboards[selectedLeaderboardVersion]
                      .disablePlatformSelection
                  }
                  onPointerEnter={() => prefetchData({ platform: value })}
                >
                  {icon}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <TooltipProvider disableHoverableContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="select-none"
                  onClick={() => queryClient.invalidateQueries()}
                  disabled={
                    disabled ||
                    Object.hasOwn(
                      leaderboards[selectedLeaderboardVersion],
                      "localData",
                    )
                  }
                >
                  <span className="mr-2 hidden min-[530px]:block">Refresh</span>

                  <RefreshCw
                    className={cn(
                      "size-4",
                      (isLoading || isRefetching) && "animate-spin",
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh data.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {error && <span className="text-red-700">Error fetching data.</span>}

        {/* Panel selector and panels */}
        {!error && (
          <div className="space-y-3">
            <Tabs
              value={selectedPanel}
              onValueChange={v => setSelectedPanel(v as Panels)}
            >
              <TabsList>
                <TabsTrigger
                  value={Panels.Table}
                  disabled={isLoading || isRefetching}
                >
                  <TableIcon className="mr-2 inline size-5" />
                  Table
                </TabsTrigger>

                <TabsTrigger
                  value={Panels.Stats}
                  disabled={
                    isLoading ||
                    isRefetching ||
                    leaderboards[selectedLeaderboardVersion].disableStatsPanel
                  }
                >
                  <BarChartIcon className="mr-2 inline size-5" />
                  Stats
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {selectedPanel === Panels.Table && (
              <DataTable
                key={selectedLeaderboardVersion}
                leaderboardVersion={selectedLeaderboardVersion}
                platform={selectedPlatform}
                // https://github.com/TanStack/table/issues/4382#issuecomment-2081153305
                columns={(
                  columns(
                    selectedLeaderboardVersion,
                    selectedPlatform,
                  ) as ColumnDef<unknown>[]
                ).filter(col =>
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
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col gap-2">
        <span>
          Current data updated at{" "}
          {isLoading || isRefetching ? (
            <Loader className="inline size-5 animate-spin" />
          ) : (
            new Date(dataUpdatedAt).toLocaleString()
          )}
        </span>

        <span className="text-sm">
          This site is not affiliated with{" "}
          <Link href="https://www.embark-studios.com/">Embark Studios</Link>.
          All imagery and data is owned by{" "}
          <Link href="https://www.embark-studios.com/">Embark Studios</Link>.
          Created by <Link href="https://twitter.com/mozzyfx">Mozzy</Link>.
          Check out the{" "}
          <Link href="https://github.com/leonlarsson/the-finals-api">API</Link>.
        </span>

        <div className="flex gap-2">
          <ThemeToggle />
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
