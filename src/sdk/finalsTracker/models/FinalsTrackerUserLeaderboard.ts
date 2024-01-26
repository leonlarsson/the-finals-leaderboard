export interface FinalsTrackerUserLeaderboardRank {
  combined: number;
  crossplay: number;
  ps: number;
  steam: number;
  xbox: number;
}

export interface FinalsTrackerUserLeaderboardRaw {
  timestamp: string;
  fame: number;
  cashout: string;
  rank: FinalsTrackerUserLeaderboardRank;
}

export interface FinalsTrackerUserLeaderboard
  extends Omit<FinalsTrackerUserLeaderboardRaw, "timestamp"> {
  timestamp: Date;
}
