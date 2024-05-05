import { Platforms } from "@/types";
import transformData from "./transformData";
import { LeaderboardId, leaderboards } from "./leaderboards";

export const fetchData = async (
  leaderboardVersion: LeaderboardId,
  platform: Platforms,
  jsonDataPath?: string,
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

  const leaderboard = leaderboards[leaderboardVersion];

  if ("localData" in leaderboard) {
    return transformData(
      leaderboardVersion,
      jsonDataPath
        ? leaderboard.localData[jsonDataPath]
        : leaderboard.localData,
    );
  }

  const res = await fetch(
    typeof leaderboard.apiUrl === "function"
      ? leaderboard.apiUrl(platform)
      : leaderboard.apiUrl,
  );
  const json = await res.json();
  return transformData(
    leaderboardVersion,
    jsonDataPath ? json[jsonDataPath] : json,
  );
};
