import {LEADERBOARD_VERSION, VERSION_LEAGUES} from "./leagues.ts";

export const fameToLeague = (leaderboard: LEADERBOARD_VERSION, fame: number): string =>
  VERSION_LEAGUES[leaderboard]
    .sort((a, b) => b.fame - a.fame)
    .find(x => fame >= x.fame)!
    .league
