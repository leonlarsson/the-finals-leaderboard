import { LeaderboardId } from "./leaderboards";
import leagueBrackets from "./leagueBrackets";

export default (leaderboard: LeaderboardId, fame: number): string => {
  if (leaderboard === "eventTerminalAttack") return "Unknown";

  return (
    leagueBrackets[leaderboard]
      .toSorted((a, b) => b.fame - a.fame)
      .find(x => fame >= x.fame)?.name ?? "Unknown"
  );
};
