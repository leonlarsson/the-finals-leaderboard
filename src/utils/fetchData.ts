import { Platforms } from "@/types";
import transformData from "./transformData";
import { LeaderboardId, leaderboards } from "./leaderboards";

export const fetchData = async (
  leaderboardVersion: LeaderboardId,
  platform: Platforms,
) => {
  const searchParams = new URLSearchParams(window.location.search);
  const useOwnApi = searchParams.get("useownapi") === "true";

  if (useOwnApi) {
    const res = await fetch(
      `https://api.the-finals-leaderboard.com/v1/leaderboard/${leaderboardVersion.toLowerCase()}/${platform}`,
    );
    const json = await res.json();
    return json.data;
  }

  const leaderboard = leaderboards[leaderboardVersion as LeaderboardId];

  const data = await leaderboard.fetchData(platform);
  return transformData(leaderboardVersion, data);
};
