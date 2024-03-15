// Docs https://api.finals-tracker.com/api/swagger/

import {
  FinalsTrackerResponse,
  FinalsTrackerResponseSuccess,
  FinalsTrackerUser,
  FinalsTrackerUserLeaderboard,
  FinalsTrackerUserLeaderboardQueryParams,
  FinalsTrackerUserLeaderboardQueryParamsRaw,
  FinalsTrackerUserLeaderboardRaw,
  FinalsTrackerUserQueryParams,
} from "./models";
import { API, FinalsTrackerUrls } from "./config";

export * from "./enums";
export * from "./models";

export type UserResponse = FinalsTrackerResponse<FinalsTrackerUser[]>;

export type HistoryByUserResponse = FinalsTrackerResponse<
  FinalsTrackerUserLeaderboard[]
>;

export const getUsers = async (
  queryParams: FinalsTrackerUserQueryParams,
): Promise<UserResponse> =>
  API.get<FinalsTrackerUserQueryParams, UserResponse>(
    FinalsTrackerUrls.USER_QUERY,
    queryParams,
  );

export const getHistoryByUser = async (
  userId: string,
  queryParams: FinalsTrackerUserLeaderboardQueryParams,
): Promise<HistoryByUserResponse> => {
  const res = await API.get<
    FinalsTrackerUserLeaderboardQueryParamsRaw,
    FinalsTrackerResponseSuccess<FinalsTrackerUserLeaderboardRaw[]>
  >(FinalsTrackerUrls.USER_LEADERBOARD.replace(":id", userId), {
    ...queryParams,
    startDate: queryParams.startDate?.toISOString(),
    endDate: queryParams.endDate?.toISOString(),
  });

  return {
    ...res,
    data: (res?.data || []).map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
    })),
  };
};
