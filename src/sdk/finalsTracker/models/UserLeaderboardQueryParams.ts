export interface UserLeaderboardQueryParams {
  name: string;
  platform?: "crossplay" | "playstation" | "xbox" | "steam";
  startDate?: Date;
  endDate?: Date;
}
