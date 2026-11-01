import {
  queryOptions,
  skipToken,
  UseQueryResult,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { BaseUserWithExtras } from "@/types";
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

// Outside the hook so it's stable, then the combined result only changes when a query result does
const combineClubLeaderboards = (
  results: UseQueryResult<BaseUserWithExtras[]>[],
) => ({
  /** Each leaderboard's rows, undefined until loaded */
  data: results.map((result) => result.data),
  isLoading: results.some((result) => result.isLoading),
  isError: results.some((result) => result.isError),
  isSuccess: results.every((result) => result.isSuccess),
  refetchFailed: () => {
    for (const result of results) {
      if (result.isError) result.refetch();
    }
  },
});

export type ClubLeaderboardsResult = ReturnType<typeof combineClubLeaderboards>;

/** The club's rows on several leaderboards, with `data` in the same order as `leaderboardIds` */
export const useClubLeaderboards = (
  leaderboardIds: LeaderboardId[],
  clubTag: string,
) =>
  useQueries({
    queries: leaderboardIds.map((id) => clubLeaderboardQuery(id, clubTag)),
    combine: combineClubLeaderboards,
  });
