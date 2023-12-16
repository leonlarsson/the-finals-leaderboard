import fameToLeague from "./fameToLeague";
import { LEADERBOARD_VERSION } from "./leagues";

export default (
  leaderboardVersion: LEADERBOARD_VERSION,
  fame: number,
  height?: number
) => {
  const league = fameToLeague(leaderboardVersion, fame);

  return (
    <img
      className="inline"
      title={`${league} league`}
      width={height ?? 60}
      src={`/images/${league.toLowerCase().replace(" ", "-")}.png`}
    />
  );
};
