import {
  FinalsTrackerResponse,
  LeaderboardUser,
  UserLeaderboardQueryParams,
} from "@/sdk/finalsTracker/models";
import { API, FinalsTrackerUrls } from "@/sdk/finalsTracker/config";

export type UserLeaderboardResponse = FinalsTrackerResponse<LeaderboardUser[]>;

export const getLeaderboardByUsername = async (
  params: UserLeaderboardQueryParams,
): Promise<UserLeaderboardResponse> => {
  try {
    const res = await API.get<
      UserLeaderboardQueryParams,
      UserLeaderboardResponse
    >(FinalsTrackerUrls.USER_LEADERBOARD, params);

    return res;
  } catch (e: any) {
    console.error(e);

    return {
      errors: e?.response?.data || ["SOMETHING WENT WRONG"],
    };
  }
};
