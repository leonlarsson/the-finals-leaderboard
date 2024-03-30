import { LeaderboardVersions, RawUser, User } from "@/types";
import fameToLeague from "./fameToLeague";
import leagueNumberToName from "./leagueNumberToName";

// The goal of this is to transform multiple formats into a universal format
export default (leaderboard: LeaderboardVersions, data: RawUser[]): User[] =>
  data.map(user => ({
    key: `${user.r}-${user.name}`,
    rank: user.r,
    leagueNumber: user.ri,
    league: user.ri
      ? leagueNumberToName(user.ri)
      : fameToLeague(leaderboard, user.f),
    change: user.or - user.r,
    name: user.name,
    steamName: user.steam,
    xboxName: user.xbox,
    psnName: user.psn,
    xp: user.x,
    level: user.mx,
    cashouts: user.c,
    fame: user.f,
  }));
