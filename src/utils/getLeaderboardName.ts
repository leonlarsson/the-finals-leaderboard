import { LeaderboardVersions } from "@/types";

export default (leaderboardVersion: LeaderboardVersions) => {
  const versions = {
    [LeaderboardVersions.CLOSED_BETA_1]: "Closed Beta 1",
    [LeaderboardVersions.CLOSED_BETA_2]: "Closed Beta 2",
    [LeaderboardVersions.OPEN_BETA]: "Open Beta",
    [LeaderboardVersions.SEASON_1]: "Season 1",
    [LeaderboardVersions.SEASON_2]: "Season 2",
  };

  return versions[leaderboardVersion] ?? "Unknown";
};
