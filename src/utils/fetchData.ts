import { LeaderboardVersions, Platforms } from "@/types";
import transformData from "./transformData";
import openBetaData from "../data/leaderboard-open-beta-1.json";
import closedBeta2Data from "../data/leaderboard-closed-beta-2.json";
import closedBeta1Data from "../data/leaderboard-closed-beta-1.json";

export const fetchData = async (
  leaderboardVersion: LeaderboardVersions,
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

  if (leaderboardVersion === LeaderboardVersions.CLOSED_BETA_1) {
    // cb1: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
    return transformData(leaderboardVersion, closedBeta1Data);
  }

  if (leaderboardVersion === LeaderboardVersions.CLOSED_BETA_2) {
    // cb2: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
    return transformData(leaderboardVersion, closedBeta2Data);
  }

  if (leaderboardVersion === LeaderboardVersions.OPEN_BETA) {
    // open beta: https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay.json
    return transformData(leaderboardVersion, openBetaData);
  }

  if (leaderboardVersion === LeaderboardVersions.SEASON_1) {
    const res = await fetch(
      `https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-${platform}-discovery-live.json`,
    );

    const json = await res.json();
    return transformData(leaderboardVersion, json);
  }

  if (leaderboardVersion === LeaderboardVersions.SEASON_2) {
    const res = await fetch(
      `https://storage.googleapis.com/embark-discovery-leaderboard/s2-leaderboard-${platform}-discovery-live.json`,
    );

    const json = await res.json();
    return transformData(leaderboardVersion, json);
  }
};
