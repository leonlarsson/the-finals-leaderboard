import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/TableColumns";
import { Button } from "./components/ui/button";
import Stats from "./components/Stats";
import Icons from "./components/icons";
import transformData from "./helpers/transformData";
import { LEADERBOARD_VERSION } from "./helpers/leagues";
import openBetaData from "./data/leaderboard-open-beta-1.json";
import closedBeta2Data from "./data/leaderboard-closed-beta-2.json";
import closedBeta1Data from "./data/leaderboard-closed-beta-1.json";
import { cn } from "./lib/utils";
import { Platforms, User } from "./types";

import "./index.css";

const App = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const leaderboardSearchParam = searchParams.get("leaderboard");
  const platformSearchParam = searchParams.get("platform");

  const initialLeaderboardVersion =
    leaderboardSearchParam &&
    Object.values(LEADERBOARD_VERSION).includes(
      leaderboardSearchParam as LEADERBOARD_VERSION,
    )
      ? leaderboardSearchParam
      : LEADERBOARD_VERSION.LIVE;

  const initialPlatform =
    platformSearchParam &&
    Object.values(Platforms).includes(platformSearchParam as Platforms)
      ? platformSearchParam
      : Platforms.Crossplay;

  const [selectedLeaderboardVersion, setSelectedLeaderboardVersion] =
    useState<LEADERBOARD_VERSION>(
      initialLeaderboardVersion as LEADERBOARD_VERSION,
    );
  const [selectedPlatform, setSelectedPlatform] = useState<Platforms>(
    initialPlatform as Platforms,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    if (selectedLeaderboardVersion === "closedBeta1") {
      setUsers(transformData(closedBeta1Data));
      setLoading(false);
      return;
    }

    if (selectedLeaderboardVersion === "closedBeta2") {
      setUsers(transformData(closedBeta2Data));
      setLoading(false);
      return;
    }

    if (selectedLeaderboardVersion === "openBeta") {
      setUsers(transformData(openBetaData));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${selectedPlatform}-discovery-live.json`,
      );
      // cb1: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
      // cb2: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
      // open beta: https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay.json

      if (res.ok) {
        const json = await res.json();
        setUsers(transformData(json));
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on load and when selected leaderboard version or platform changes
  useEffect(() => {
    fetchData();
  }, [selectedLeaderboardVersion, selectedPlatform]);

  // Store selected leaderboard version and platform in URL
  // Perhaps not the best way to do it, but it works
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    selectedLeaderboardVersion === LEADERBOARD_VERSION.LIVE
      ? searchParams.delete("leaderboard")
      : searchParams.set("leaderboard", selectedLeaderboardVersion);

    selectedPlatform === Platforms.Crossplay
      ? searchParams.delete("platform")
      : searchParams.set("platform", selectedPlatform);

    window.history.replaceState(
      null,
      "",
      searchParams.size > 0 ? `?${searchParams.toString()}` : "/",
    );
  }, [selectedLeaderboardVersion, selectedPlatform]);

  const disabled =
    selectedLeaderboardVersion !== LEADERBOARD_VERSION.LIVE || loading;

  return (
    <div className="container mb-12 font-saira">
      <h1 className="text-2xl font-medium underline min-[440px]:text-4xl">
        Unofficial Leaderboard – THE FINALS
      </h1>
      <h5 className="text-base min-[440px]:text-xl">
        View leaderboards from THE FINALS and track your progress. Created by{" "}
        <a
          href="https://twitter.com/mozzyfx"
          target="_blank"
          className="font-medium hover:underline"
        >
          Leon
        </a>
        .
      </h5>

      <div className="my-4 flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          <Tabs
            value={selectedLeaderboardVersion}
            onValueChange={e => {
              // Set loading to true if we're switching to live to avoid a short state of the platform select being available
              if (e === LEADERBOARD_VERSION.LIVE) setLoading(true);
              setSelectedLeaderboardVersion(e as LEADERBOARD_VERSION);
            }}
          >
            <TabsList>
              <TabsTrigger value={LEADERBOARD_VERSION.LIVE}>Live</TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.OPEN_BETA}>
                <span className="hidden min-[440px]:block">Open Beta</span>
                <span className="block min-[440px]:hidden">Beta</span>
              </TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.CLOSED_BETA_2}>
                <span className="hidden min-[440px]:block">Closed Beta 2</span>
                <span className="block min-[440px]:hidden">CB2</span>
              </TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.CLOSED_BETA_1}>
                <span className="hidden min-[440px]:block">Closed Beta 1</span>
                <span className="block min-[440px]:hidden">CB1</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs
            defaultValue={selectedPlatform}
            onValueChange={e => setSelectedPlatform(e as Platforms)}
          >
            <TabsList>
              <TabsTrigger
                value={Platforms.Crossplay}
                title="Crossplay"
                disabled={disabled}
              >
                <Icons.crossplay className="inline size-5" />
              </TabsTrigger>
              <TabsTrigger
                value={Platforms.Steam}
                title="Steam"
                disabled={disabled}
              >
                <Icons.steam className="inline size-5" />
              </TabsTrigger>
              <TabsTrigger
                value={Platforms.Xbox}
                title="Xbox"
                disabled={disabled}
              >
                <Icons.xbox className="inline size-5" />
              </TabsTrigger>
              <TabsTrigger
                value={Platforms.PSN}
                title="PlayStation"
                disabled={disabled}
              >
                <Icons.playstation className="inline size-5" />
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            className="group select-none"
            title="Refresh data."
            onClick={fetchData}
            disabled={disabled}
          >
            <span className="mr-2 hidden min-[440px]:block">Refresh</span>

            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </Button>
        </div>

        {error && <span className="text-red-700">Error fetching data.</span>}
        {!error && (
          <>
            <DataTable
              leaderboardVersion={selectedLeaderboardVersion}
              platform={selectedPlatform}
              columns={columns(selectedLeaderboardVersion, selectedPlatform)}
              data={users}
            />
          </>
        )}
      </div>

      <Stats
        leaderboardVersion={selectedLeaderboardVersion}
        platform={selectedPlatform}
        users={users}
      />

      <div className="mt-10">
        <span className="text-sm">
          All imagery and data is owned by{" "}
          <a
            href="https://www.embark-studios.com/"
            target="_blank"
            className="font-medium hover:underline"
          >
            Embark Studios
          </a>
          . Source{" "}
          <a
            href="https://github.com/leonlarsson/the-finals-leaderboard"
            target="_blank"
            className="font-medium hover:underline"
          >
            here
          </a>
          .
        </span>
      </div>
    </div>
  );
};

export default App;
