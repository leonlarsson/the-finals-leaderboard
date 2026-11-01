import { BaseUserWithExtras, LeaderboardFeature } from "@/types";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";

const clubMetrics = ["fame", "cashouts", "fans", "points"] as const;

/**
 * What a club's total is made of on a leaderboard, the same metrics the main page's Clubs panel uses:
 * rank score on ranked leaderboards, $ cashouts on World Tour, fans on sponsor ones, points on the modes
 */
export const clubMetric = (leaderboardId: string) => {
  const columns = (leaderboards[leaderboardId as LeaderboardId]?.tableColumns ??
    []) as string[];
  return clubMetrics.find((metric) => columns.includes(metric));
};

/** A club total formatted for its leaderboard, e.g. "70,374 rank score" or "$38,098,150" */
export const formatClubValue = (leaderboardId: string, value: number) => {
  const amount = value.toLocaleString("en");
  switch (clubMetric(leaderboardId)) {
    case "fame":
      return `${amount} rank score`;
    case "cashouts":
      return `$${amount}`;
    case "fans":
      return `${amount} fans`;
    case "points":
      return `${amount} points`;
    default:
      return amount;
  }
};

/** What one member adds to the club's total on a leaderboard */
export const memberClubValue = (
  leaderboardId: string,
  user: BaseUserWithExtras,
) => {
  const metric = clubMetric(leaderboardId);
  if (metric === "fame") return user.rankScore ?? user.fame ?? 0;
  return (metric && user[metric]) || 0;
};

/** The base ranked leaderboard of a season, e.g. Season 12 but not Season 12 World Tour */
export const isRankedSeasonLeaderboard = (leaderboardId: string) =>
  (
    leaderboards[leaderboardId as LeaderboardId]?.features as
      | LeaderboardFeature[]
      | undefined
  )?.includes("rankedSeason") ?? false;

/**
 * A linear scale for bar charts of club ranks, zoomed to the club's own range, with better ranks as taller bars.
 * The axis goes from #1 down to a round number just past the club's worst rank, instead of always to #10,000
 */
export const clubRankChartScale = (ranks: number[]) => {
  const worstRank = Math.max(...ranks, 1);
  // The smallest round number (1, 2, 2.5 or 5 times a power of ten) with some room below the worst rank
  const target = Math.max(10, worstRank * 1.1);
  const magnitude = 10 ** Math.floor(Math.log10(target));
  const bottom =
    [1, 2, 2.5, 5, 10]
      .map((step) => step * magnitude)
      .find((value) => value >= target) ?? 10 * magnitude;
  return {
    toBarValue: (rank: number) => bottom - rank,
    domain: [0, bottom] as [number, number],
    // The top of the axis is shown as #1, the best possible rank
    formatTick: (value: number) =>
      `#${Math.max(1, Math.round(bottom - value)).toLocaleString("en")}`,
  };
};
