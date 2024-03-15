import { numberToLeague } from "./leagues";

export default (leagueNumber: number, height?: number) => {
  const league = numberToLeague(leagueNumber);

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
