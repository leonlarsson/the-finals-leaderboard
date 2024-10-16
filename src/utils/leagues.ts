import { LeaderboardId, leaderboards } from "./leaderboards";

const CLOSED_BETA_ONE_LEAGUES = ["Bronze", "Silver", "Gold", "Diamond"];

const CLOSED_BETA_TWO_LEAGUES = [
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",

  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",

  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",

  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",

  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",
];

const SEASON_1_LEAGUES = [
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",

  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",

  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",

  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",

  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",
];

const SEASON_2_LEAGUES = [
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",

  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",

  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",

  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",

  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",
];

const SEASON_3_LEAGUES = [
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",

  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",

  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",

  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",

  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",

  "Ruby",
];

const SEASON_4_LEAGUES = [
  "Bronze 4",
  "Bronze 3",
  "Bronze 2",
  "Bronze 1",

  "Silver 4",
  "Silver 3",
  "Silver 2",
  "Silver 1",

  "Gold 4",
  "Gold 3",
  "Gold 2",
  "Gold 1",

  "Platinum 4",
  "Platinum 3",
  "Platinum 2",
  "Platinum 1",

  "Diamond 4",
  "Diamond 3",
  "Diamond 2",
  "Diamond 1",

  "Ruby",
];

export default {
  [leaderboards.closedBeta1.id]: CLOSED_BETA_ONE_LEAGUES,
  [leaderboards.closedBeta2.id]: CLOSED_BETA_TWO_LEAGUES,
  [leaderboards.openBeta.id]: CLOSED_BETA_TWO_LEAGUES,
  [leaderboards.season1.id]: SEASON_1_LEAGUES,
  [leaderboards.season2.id]: SEASON_2_LEAGUES,
  [leaderboards.season3.id]: SEASON_3_LEAGUES,
  [leaderboards.season3Original.id]: SEASON_3_LEAGUES,
  [leaderboards.season4.id]: SEASON_4_LEAGUES,
  // @ts-ignore Some leaderboards do not have leagues
} satisfies Record<LeaderboardId, string[]>;
