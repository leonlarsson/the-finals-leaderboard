import { LeaderboardVersions } from "@/types";

export default (version: LeaderboardVersions) =>
  [LeaderboardVersions.SEASON_1, LeaderboardVersions.SEASON_2].includes(
    version,
  );
