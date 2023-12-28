export interface UserLeaderboardQueryParams {
  platform?: "crossplay" | "playstation" | "xbox" | "steam";
  startDate?: Date;
  endDate?: Date;
}
