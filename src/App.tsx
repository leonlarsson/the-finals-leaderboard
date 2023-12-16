import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LEADERBOARD_VERSION } from "./helpers/leagues";

import "./index.css";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/TableColumns";
import transformData from "./helpers/transformData";
import openBetaData from "./data/leaderboard-open-beta-1.json";
import closedBeta2Data from "./data/leaderboard-closed-beta-2.json";
import closedBeta1Data from "./data/leaderboard-closed-beta-1.json";
import { useEffect, useState } from "react";
import { User } from "./types";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

const App = () => {
  const [selectedLeaderboardVersion, setSelectedLeaderboardVersion] =
    useState<LEADERBOARD_VERSION>(LEADERBOARD_VERSION.LIVE);
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const usersToShow = users.filter(user =>
    [user.name, user.steamName, user.xboxName, user.psnName].some(username =>
      username?.toLowerCase().includes(search.toLowerCase())
    )
  );
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    setError(false);
    if (selectedLeaderboardVersion === "closedBeta1") {
      const initialUsers = transformData(closedBeta1Data);
      setUsers(initialUsers);
      return;
    }

    if (selectedLeaderboardVersion === "closedBeta2") {
      const initialUsers = transformData(closedBeta2Data);
      setUsers(initialUsers);
      return;
    }

    if (selectedLeaderboardVersion === "openBeta") {
      const initialUsers = transformData(openBetaData);
      setUsers(initialUsers);
      return;
    }

    try {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay-discovery-live.json"
      );
      // cb1: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
      // cb2: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
      // open beta: https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay.json

      if (res.ok) {
        const json = await res.json();
        const initialUsers = transformData(json);
        setUsers(initialUsers);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedLeaderboardVersion]);

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

      <hr className="my-2" />

      <div className="flex flex-col gap-2">
        <Input
          placeholder="Search for username..."
          value={search}
          onInput={e => setSearch(e.currentTarget.value)}
        />

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
              className="select-none"
              onClick={fetchData}
              disabled={selectedLeaderboardVersion !== LEADERBOARD_VERSION.LIVE}
            >
              Refresh
            </Button>
          </div>
        </Tabs>

        {error && <span className="text-red-700">Error fetching data.</span>}
        {!error && (
          <>
            <DataTable
              columns={columns(selectedLeaderboardVersion)}
              data={usersToShow}
            />
          </>
        )}
      </div>

      <div>STATS HERE</div>

      <div className="mt-10">
        <span className="text-sm">
          All imagery and data is owned by Embark Studios.
        </span>
      </div>
    </div>
  );
};

export default App;
