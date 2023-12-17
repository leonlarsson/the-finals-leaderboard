import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
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
  const [selectedLeaderboardVersion, setSelectedLeaderboardVersion] =
    useState<LEADERBOARD_VERSION>(LEADERBOARD_VERSION.LIVE);
  const [selectedPlatform, setSelectedPlatform] =
    useState<Platforms>("crossplay");
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
        `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${selectedPlatform}-discovery-live.json`
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

  useEffect(() => {
    fetchData();
  }, [selectedLeaderboardVersion, selectedPlatform]);

  return (
    <div className="container mb-12 font-saira">
      <h1 className="text-4xl font-medium underline">
        Unofficial Leaderboard – THE FINALS
      </h1>
      <h5 className="text-xl">
        View leaderboards from THE FINALS and track your progress. Created by{" "}
        <a
          href="https://twitter.com/mozzyfx"
          target="_blank"
          className="font-medium hover:underline"
        >
          Leon
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
      </h5>

      <div className="flex flex-col gap-2 my-4">
        <Tabs
          value={selectedLeaderboardVersion}
          onValueChange={e =>
            setSelectedLeaderboardVersion(e as LEADERBOARD_VERSION)
          }
        >
          <div className="flex gap-2 flex-wrap">
            <TabsList>
              <TabsTrigger value={LEADERBOARD_VERSION.LIVE}>Live</TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.OPEN_BETA}>
                Open Beta
              </TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.CLOSED_BETA_2}>
                Closed Beta 2
              </TabsTrigger>
              <TabsTrigger value={LEADERBOARD_VERSION.CLOSED_BETA_1}>
                Closed Beta 1
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              className="group select-none"
              onClick={fetchData}
              disabled={
                selectedLeaderboardVersion !== LEADERBOARD_VERSION.LIVE ||
                loading
              }
            >
              Refresh
              <RefreshCw
                className={cn("ml-2 h-4 w-4", loading && "animate-spin")}
              />
            </Button>

            <Select
              value={selectedPlatform}
              onValueChange={e => setSelectedPlatform(e as Platforms)}
              disabled={
                selectedLeaderboardVersion !== LEADERBOARD_VERSION.LIVE ||
                loading
              }
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crossplay">Crossplay</SelectItem>
                <SelectItem value="steam">
                  <div className="flex gap-1 items-center">
                    <Icons.steam className="h-4 inline" /> <span>Steam</span>
                  </div>
                </SelectItem>
                <SelectItem value="xbox">
                  <div className="flex gap-1 items-center">
                    <Icons.xbox className="h-4 inline" /> <span>Xbox</span>
                  </div>
                </SelectItem>
                <SelectItem value="psn">
                  <div className="flex gap-1 items-center">
                    <Icons.playstation className="h-4 inline" />{" "}
                    <span>PlayStation</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Tabs>

        {error && <span className="text-red-700">Error fetching data.</span>}
        {!error && (
          <>
            <DataTable
              columns={columns(selectedLeaderboardVersion, selectedPlatform)}
              data={users}
            />
          </>
        )}
      </div>

      <Stats leaderboardVersion={selectedLeaderboardVersion} users={users} />

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
          .
        </span>
      </div>
    </div>
  );
};

export default App;
