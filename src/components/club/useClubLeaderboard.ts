import {
  queryOptions,
  skipToken,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { fetchClubLeaderboard } from "@/utils/clubApi";
import { LeaderboardId } from "@/utils/leaderboards";

const clubLeaderboardQuery = (
  leaderboardId: LeaderboardId | undefined,
  clubTag: string,
) =>
  queryOptions({
    queryKey: ["clubLeaderboard", leaderboardId, clubTag.toLowerCase()],
    queryFn: leaderboardId
      ? ({ signal }) => fetchClubLeaderboard(leaderboardId, clubTag, { signal })
      : skipToken,
    staleTime: Infinity,
  });

/** The club's rows on one leaderboard. Shared cache across the club page tabs */
export const useClubLeaderboard = (
  leaderboardId: LeaderboardId | undefined,
  clubTag: string,
) => useQuery(clubLeaderboardQuery(leaderboardId, clubTag));

/** The club's rows on several leaderboards, in the same order as `leaderboardIds` */
export const useClubLeaderboards = (
  leaderboardIds: LeaderboardId[],
  clubTag: string,
) =>
  useQueries({
    queries: leaderboardIds.map((id) => clubLeaderboardQuery(id, clubTag)),
  });
