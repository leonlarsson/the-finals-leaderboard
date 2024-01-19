export const API = {
  get: <ParamType, ReturnType>(
    url: string,
    params: ParamType,
  ): Promise<ReturnType> =>
    fetch(
      `https://api.finals-tracker.com/api/${url}?${new URLSearchParams(
        Object.entries(params ?? {}),
      ).toString()}`,
    ).then(response => response.json()),
};

export enum FinalsTrackerUrls {
  USER_LEADERBOARD = "/v1/users/leaderboard",
}
