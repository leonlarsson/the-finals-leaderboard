import leagueNumberToName from "./leagueNumberToName";

export default (leagueNumber: number, height?: number) => {
  const league = leagueNumberToName(leagueNumber);

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
