import { RawUser, User } from "@/types";
import { LEADERBOARD_VERSION, numberToLeague } from "./leagues";
import fameToLeague from "./fameToLeague";

// The goal of this is to transform multiple formats into a universal format
export default (leaderboard: LEADERBOARD_VERSION, data: RawUser[]): User[] =>
  data.map(user => ({
    key: `${user.r}-${user.name}`,
    rank: user.r,
    leagueNumber: user.ri,
    league: user.ri
      ? numberToLeague(user.ri)
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
