import {
  FinalsTrackerResponse,
  UserLeaderboardData,
  UserLeaderboardQueryParams,
} from "@/sdk/finalsTracker/models";
import { API, FinalsTrackerUrls } from "@/sdk/finalsTracker/config";
import { AxiosResponse } from "axios";

export type UserLeaderboardResponse = FinalsTrackerResponse<
  UserLeaderboardData[]
>;

export const getLeaderboardByUsername = async (
  username: string,
  queryParams?: UserLeaderboardQueryParams,
): Promise<AxiosResponse<UserLeaderboardResponse, any>> =>
  API.get<UserLeaderboardResponse>(
    FinalsTrackerUrls.USER_LEADERBOARD.replace(":name", username),
    { params: queryParams },
  );
