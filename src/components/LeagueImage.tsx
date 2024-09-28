type LeagueImageProps = {
  league: string;
  size?: number;
};

export default ({ league, size = 60 }: LeagueImageProps) => {
  return (
    <img
      className="inline"
      draggable={false}
      title={`${league} league`}
      width={size}
      alt={`${league} league`}
      src={`/images/leagues/${league.toLowerCase().replace(" ", "-")}.png`}
    />
  );
};
