export enum LEADERBOARD_VERSION {
  CLOSED_BETA_1 = "closedBeta1",
  CLOSED_BETA_2 = "closedBeta2",
  OPEN_BETA = "openBeta",
  LIVE = "live"
}

interface FameLeague {
  fame: number,
  league: string
}

const CLOSED_BETA_ONE_LEAGUES: FameLeague[] = [
  { fame: 0, league: "bronze" },
  { fame: 500, league: "Silver" },
  { fame: 1000, league: "Gold" },
  { fame: 5000, league: "Diamond" }
]

const CLOSED_BETA_TWO_LEAGUES: FameLeague[] = [
  { fame: 0, league: "Bronze 4" },
  { fame: 1250, league: "Bronze 3" },
  { fame: 2500, league: "Bronze 2" },
  { fame: 3750, league: "Bronze 1" },

  { fame: 5000, league: "Silver 4" },
  { fame: 6250, league: "Silver 3" },
  { fame: 7500, league: "Silver 2" },
  { fame: 8750, league: "Silver 1" },

  { fame: 10000, league: "Gold 4" },
  { fame: 11250, league: "Gold 3" },
  { fame: 12500, league: "Gold 2" },
  { fame: 13750, league: "Gold 1" },

  { fame: 15000, league: "Platinum 4" },
  { fame: 11250, league: "Platinum 3" },
  { fame: 12500, league: "Platinum 2" },
  { fame: 18750, league: "Platinum 1" },

  { fame: 20000, league: "Diamond 4" },
  { fame: 21250, league: "Diamond 3" },
  { fame: 22500, league: "Diamond 2" },
  { fame: 23750, league: "Diamond 1" }
]

const LIVE_LEAGUES: FameLeague[] = [
  { fame: 0, league: "Bronze 4" },
  { fame: 250, league: "Bronze 3" },
  { fame: 500, league: "Bronze 2" },
  { fame: 1000, league: "Bronze 1" },

  { fame: 1750, league: "Silver 4" },
  { fame: 2500, league: "Silver 3" },
  { fame: 3500, league: "Silver 2" },
  { fame: 4500, league: "Silver 1" },

  { fame: 6500, league: "Gold 4" },
  { fame: 8500, league: "Gold 3" },
  { fame: 10_500, league: "Gold 2" },
  { fame: 12_500, league: "Gold 1" },

  { fame: 15_500, league: "Platinum 4" },
  { fame: 18_500, league: "Platinum 3" }, // maybe
  { fame: 21_500, league: "Platinum 2" }, // maybe
  { fame: 24_500, league: "Platinum 1" }, // maybe

  { fame: 28_500, league: "Diamond 4" }, // maybe
  { fame: 32_750, league: "Diamond 3" }, // maybe
  { fame: 37_250, league: "Diamond 2" }, // maybe
  { fame: 42_500, league: "Diamond 1" } // maybe
]

export const VERSION_LEAGUES: Record<LEADERBOARD_VERSION, FameLeague[]> = {
  [LEADERBOARD_VERSION.CLOSED_BETA_1]: CLOSED_BETA_ONE_LEAGUES,
  [LEADERBOARD_VERSION.CLOSED_BETA_2]: CLOSED_BETA_TWO_LEAGUES,
  [LEADERBOARD_VERSION.OPEN_BETA]: CLOSED_BETA_TWO_LEAGUES,
  [LEADERBOARD_VERSION.LIVE]: LIVE_LEAGUES
}

