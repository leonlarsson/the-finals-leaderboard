import { LeaderboardId, leaderboards } from "@/utils/leaderboards";

/**
 * A club total formatted for its leaderboard, the same metrics the main page's Clubs panel uses:
 * rank score on ranked leaderboards, fans on sponsor ones, $ cashouts on World Tour, points on the modes
 */
export const formatClubValue = (leaderboardId: string, value: number) => {
  const columns = (leaderboards[leaderboardId as LeaderboardId]?.tableColumns ??
    []) as string[];
  const amount = value.toLocaleString("en");
  if (columns.includes("fame")) return `${amount} rank score`;
  if (columns.includes("cashouts")) return `$${amount}`;
  if (columns.includes("fans")) return `${amount} fans`;
  if (columns.includes("points")) return `${amount} points`;
  return amount;
};

/** The base ranked leaderboard of a season, e.g. "season12", which shares its name with the season */
export const isRankedSeasonLeaderboard = (
  leaderboardId: string,
  season: string,
) => leaderboards[leaderboardId as LeaderboardId]?.name === season;

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
