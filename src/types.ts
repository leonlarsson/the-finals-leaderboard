export type BaseUser = {
  rank: number;
  leagueNumber?: number;
  league: string;
  change: number;
  name: string;
  steamName: string;
  xboxName: string;
  psnName: string;
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
};

export enum Platforms {
  Crossplay = "crossplay",
  Steam = "steam",
  Xbox = "xbox",
  PSN = "psn",
}

export enum Panels {
  Leaderboard = "leaderboard",
  Stats = "stats",
}
