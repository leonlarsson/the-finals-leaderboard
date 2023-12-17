import { RawUser, User } from "@/types";

export default (data: RawUser[]): User[] =>
  data.map(user => ({
    key: `${user.c}-${user.name}`,
    rank: user.r,
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
