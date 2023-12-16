export enum LEADERBOARD_VERSION {
  CLOSED_BETA_1 = "closedBeta1",
  CLOSED_BETA_2 = "closedBeta2",
  OPEN_BETA = "openBeta",
  LIVE = "live",
}

type FameLeague = {
  fame: number;
  league: string;
};

const CLOSED_BETA_ONE_LEAGUES = [
  { fame: 0, league: "Bronze" },
  { fame: 500, league: "Silver" },
  { fame: 1_000, league: "Gold" },
  { fame: 5_000, league: "Diamond" },
] satisfies FameLeague[];

const CLOSED_BETA_TWO_LEAGUES = [
  { fame: 0, league: "Bronze 4" },
  { fame: 1_250, league: "Bronze 3" },
  { fame: 2_500, league: "Bronze 2" },
  { fame: 3_750, league: "Bronze 1" },

  { fame: 5_000, league: "Silver 4" },
  { fame: 6_250, league: "Silver 3" },
  { fame: 7_500, league: "Silver 2" },
  { fame: 8_750, league: "Silver 1" },

  { fame: 10_000, league: "Gold 4" },
  { fame: 11_250, league: "Gold 3" },
  { fame: 12_500, league: "Gold 2" },
  { fame: 13_750, league: "Gold 1" },

  { fame: 15_000, league: "Platinum 4" },
  { fame: 16_250, league: "Platinum 3" },
  { fame: 17_500, league: "Platinum 2" },
  { fame: 18_750, league: "Platinum 1" },

  { fame: 20_000, league: "Diamond 4" },
  { fame: 21_250, league: "Diamond 3" },
  { fame: 22_500, league: "Diamond 2" },
  { fame: 23_750, league: "Diamond 1" },
] satisfies FameLeague[];

// TODO: Website and game are currently inconsistent. Poke Embark about this. Below are the website values.
const LIVE_LEAGUES = [
  { fame: 0, league: "Bronze 4" },
  { fame: 1_250, league: "Bronze 3" },
  { fame: 2_500, league: "Bronze 2" },
  { fame: 3_750, league: "Bronze 1" },

  { fame: 5_000, league: "Silver 4" },
  { fame: 6_250, league: "Silver 3" },
  { fame: 7_500, league: "Silver 2" },
  { fame: 8_750, league: "Silver 1" },

  { fame: 10_000, league: "Gold 4" },
  { fame: 11_250, league: "Gold 3" },
  { fame: 12_500, league: "Gold 2" },
  { fame: 13_750, league: "Gold 1" },

  { fame: 15_000, league: "Platinum 4" },
  { fame: 16_250, league: "Platinum 3" },
  { fame: 17_500, league: "Platinum 2" },
  { fame: 18_750, league: "Platinum 1" },

  { fame: 20_000, league: "Diamond 4" },
  { fame: 21_250, league: "Diamond 3" },
  { fame: 22_500, league: "Diamond 2" },
  { fame: 23_750, league: "Diamond 1" },
] satisfies FameLeague[];

export const VERSION_LEAGUES = {
  [LEADERBOARD_VERSION.CLOSED_BETA_1]: CLOSED_BETA_ONE_LEAGUES,
  [LEADERBOARD_VERSION.CLOSED_BETA_2]: CLOSED_BETA_TWO_LEAGUES,
  [LEADERBOARD_VERSION.OPEN_BETA]: CLOSED_BETA_TWO_LEAGUES,
  [LEADERBOARD_VERSION.LIVE]: LIVE_LEAGUES,
} satisfies Record<LEADERBOARD_VERSION, FameLeague[]>;
