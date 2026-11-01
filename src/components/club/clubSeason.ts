import { defaultLeaderboardId, getSeasonGroup } from "@/utils/leaderboards";

/** The season group of the current leaderboard, e.g. "Season 12" */
export const currentSeason = getSeasonGroup(defaultLeaderboardId);

/** "Season 12 World Tour" -> "World Tour" inside the Season 12 group. The base leaderboard keeps its full name. */
export const stripSeasonPrefix = (name: string, season: string) =>
  season.startsWith("Season ") && name.startsWith(`${season} `)
    ? name.slice(season.length + 1).replace(/^- /, "")
    : name;
