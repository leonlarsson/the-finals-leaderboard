import { RawUser, User } from "@/types";
import fameToLeague from "./fameToLeague";
import leagueNumberToName from "./leagueNumberToName";
import { LeaderboardId } from "./leaderboards";

// The goal of this is to transform multiple formats into a universal format
export default (leaderboard: LeaderboardId, data: RawUser[]): User[] =>
  data.map(user => ({
    key: `${user.r}-${user.name}`,
    rank: user.r,
    leagueNumber: user.ri,
    league:
      "ri" in user || "f" in user
        ? user.ri
          ? leagueNumberToName(user.ri)
          : fameToLeague(leaderboard, user.f)
        : "N/A",
    change: user.or - user.r,
    name: user.name,
    steamName: user.steam,
    xboxName: user.xbox,
    psnName: user.psn,
    xp: user.x,
    level: user.mx,
    cashouts: user.c,
    fame: user.f,

    // Exclusive to Platform Push
    distance: user.d,

    // Exclusive to Terminal Attack
    gamesWon: user.wg,
    roundsWon: user.wr,
    totalRounds: user.tr,
    eliminations: user.k,
    score: user.s,
  }));
