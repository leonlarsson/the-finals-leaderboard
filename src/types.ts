export type BaseUser = {
  rank: number;
  leagueNumber?: number;
  league: string;
  change: number;
  name: string;
  steamName: string;
  xboxName: string;
  psnName: string;
  clubTag?: string;
  clubUuid?: string;
  officialClubName?: string;
  xp?: number;
  level?: number;
  cashouts?: number;
  fame?: number;
  rankScore?: number;
  sponsor?: string;
  fans?: number;
  points?: number;
};

/** A type with the base values plus any additional extras (special events, modes) */
export type BaseUserWithExtras = BaseUser & {
  distance?: number;
  gamesWon?: number;
  roundsWon?: number;
  totalRounds?: number;
  eliminations?: number;
  score?: number;
  damageDone?: number;
  tournamentWins?: number;
  /** ISO timestamp of when this entry was last indexed. Only present on data from the player API. */
  updatedAt?: string;
};

export type Club = {
  rank: number;
  clubTag: string;
  officialClubName?: string;
  members: number;
  totalValue: number;
};

export type LeaderboardFeature =
  | "platformSelection"
  | "statsPanel"
  | "clubsPanel"
  | "leagueFilter"
  | "statsPanelMovers"
  /** The base ranked leaderboard of a season, e.g. Season 12 but not Season 12 World Tour */
  | "rankedSeason";

export const panels = {
  LEADERBOARD: "leaderboard",
  STATS: "stats",
  CLUBS: "clubs",
};

export enum CompareMode {
  Players = "players",
  Clubs = "clubs",
}

export const platforms = {
  CROSSPLAY: "crossplay",
  STEAM: "steam",
  XBOX: "xbox",
  PSN: "psn",
};
