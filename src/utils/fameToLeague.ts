import { LeaderboardVersions } from "@/types";
import leagueBrackets from "./leagueBrackets";

export default (leaderboard: LeaderboardVersions, fame: number): string =>
  leagueBrackets[leaderboard]
    .toSorted((a, b) => b.fame - a.fame)
    .find(x => fame >= x.fame)?.name ?? "Unknown";
