import { platforms } from "@/types";
import { LeaderboardId, leaderboards } from "./leaderboards";

export const fetchData = async (
  leaderboardVersion: LeaderboardId,
  platform: (typeof platforms)[keyof typeof platforms],
) => {
  const leaderboard = leaderboards[leaderboardVersion as LeaderboardId];
  const data = await leaderboard.fetchData(platform);

  // If the leaderboard has a transformData function, use it and return the transformed data
  if ("transformData" in leaderboard) {
    // @ts-ignore TS doesn't know what this funcion is because it's not used at times
    const transformedData = leaderboard.transformData(data);
    return transformedData;
  }

  // If the data is not an array, throw an error
  if (!Array.isArray(data)) {
    throw new Error("Data from leaderboard.fetchData() is not an array");
  }

  return data;
};
