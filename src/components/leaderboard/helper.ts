import {User} from "../../types.ts";
import {Filter, Platform} from "./LeaderboardFilters.tsx";

export const filterUsers = (user: User, filter: Filter) =>
  userNameMatches(user, filter.user) && platformMatches(user, filter.platforms)

const userNameMatches = (user: User, search: string | undefined) =>
  search ? [user.name, user.steamName, user.xboxName, user.psnName].some(
    username => username?.toLowerCase().includes(search.toLowerCase()),
  ) : true

export const platformMatches = (user: User, platforms: Platform[]) =>
  platforms.length === 0 ? true : platforms.includes(Platform.PLAYSTATION) && user.psnName
      || platforms.includes(Platform.XBOX) && user.xboxName
      || platforms.includes(Platform.STEAM) && user.steamName
