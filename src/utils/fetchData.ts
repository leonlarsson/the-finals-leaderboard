import { Platforms } from "@/types";
import { LeaderboardId, leaderboards } from "./leaderboards";

export const fetchData = async (
  leaderboardVersion: LeaderboardId,
  platform: Platforms,
) => {
  const leaderboard = leaderboards[leaderboardVersion as LeaderboardId];
  const data = await leaderboard.fetchData(platform);

  // If the leaderboard has a transformData function, use it and return the transformed data
  if ("transformData" in leaderboard) {
    const transformedData = leaderboard.transformData(data);
    return transformedData;
  }

  return data;
};
