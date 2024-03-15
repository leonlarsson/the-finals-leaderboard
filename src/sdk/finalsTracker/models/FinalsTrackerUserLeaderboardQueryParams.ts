import { FinalsTrackerInterval, FinalsTrackerStrategy } from "../enums";

export interface FinalsTrackerUserLeaderboardQueryParamsRaw {
  interval: FinalsTrackerInterval;
  strategy: FinalsTrackerStrategy;
  startDate: string;
  endDate: string;
}

export interface FinalsTrackerUserLeaderboardQueryParams
  extends Omit<
    FinalsTrackerUserLeaderboardQueryParamsRaw,
    "startDate" | "endDate"
  > {
  interval: FinalsTrackerInterval;
  strategy: FinalsTrackerStrategy;
  startDate: Date;
  endDate: Date;
}
