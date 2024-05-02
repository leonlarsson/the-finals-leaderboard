import { LeaderboardId, leaderboards } from "./leaderboards";

export default (version: LeaderboardId) =>
  version === leaderboards.season1.id || version === leaderboards.season2.id;
