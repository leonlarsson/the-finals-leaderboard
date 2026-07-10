import { LeaderboardId, leaderboards } from "./leaderboards";

const CLOSED_BETA_ONE_LEAGUES = ["Bronze", "Silver", "Gold", "Diamond"];

const STANDARD_LEAGUES = [
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

const STANDARD_LEAGUES_WITH_RUBY = [...STANDARD_LEAGUES, "Ruby"];

export default {
  [leaderboards.closedBeta1.id]: CLOSED_BETA_ONE_LEAGUES,
  [leaderboards.closedBeta2.id]: STANDARD_LEAGUES,
  [leaderboards.openBeta.id]: STANDARD_LEAGUES,
  [leaderboards.season1.id]: STANDARD_LEAGUES,
  [leaderboards.season2.id]: STANDARD_LEAGUES,
  [leaderboards.season3.id]: STANDARD_LEAGUES,
  [leaderboards.season3Original.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season4.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season5.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season6.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season7.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season8.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season9.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season10.id]: STANDARD_LEAGUES_WITH_RUBY,
  [leaderboards.season11.id]: STANDARD_LEAGUES_WITH_RUBY,
  // @ts-ignore Some leaderboards do not have leagues
} satisfies Record<LeaderboardId, string[]>;
