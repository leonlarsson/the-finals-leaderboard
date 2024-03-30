export type RawUser = {
  /** The user's rank. */
  r: number;
  /** The user's rank number Maps to a league. Only in Season 2. */
  ri?: number;
  /** The user's name. */
  name: string;
  /** The user's fame. */
  f: number;
  /** Also the user's fame? */
  of: number;
  /** The user's change in rank. */
  or: number;
  /** The user's cashouts. */
  c: number;
  /** The user's XP. Available in versions 1 and 2. */
  x?: number;
  /** The user's level. Available in versions 1 and 2. */
  mx?: number;
  /** The user's Steam name. */
  steam?: string;
  /** The user's Xbox name. */
  xbox?: string;
  /** The user's PSN name. */
  psn?: string;
};

export type User = {
  key: string;
  rank: number;
  leagueNumber?: number;
  league: string;
  change: number;
  name: string;
  steamName?: string;
  xboxName?: string;
  psnName?: string;
  xp?: number;
  level?: number;
  cashouts: number;
  fame: number;
};

export enum Platforms {
  Crossplay = "crossplay",
  Steam = "steam",
  Xbox = "xbox",
  PSN = "psn",
}

export enum Panels {
  Table = "table",
  Stats = "stats",
}

export type FameLeague = {
  fame: number;
  name: string;
};

export enum LeaderboardVersions {
  CLOSED_BETA_1 = "closedBeta1",
  CLOSED_BETA_2 = "closedBeta2",
  OPEN_BETA = "openBeta",
  SEASON_1 = "season1",
  SEASON_2 = "season2",
}
