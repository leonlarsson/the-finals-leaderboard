import { LeaderboardVersions } from "@/types";
import fameToLeague from "./fameToLeague";

export default (
  leaderboardVersion: LeaderboardVersions,
  fame: number,
  height?: number,
) => {
  const league = fameToLeague(leaderboardVersion, fame);

  return (
    <img
      className="inline"
      title={`${league} league`}
      width={height ?? 60}
      alt={`${league} league image`}
      src={`/images/${league.toLowerCase().replace(" ", "-")}.png`}
    />
  );
};
