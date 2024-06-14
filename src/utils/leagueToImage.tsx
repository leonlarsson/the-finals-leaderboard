export default (league: string, height?: number) => {
  return (
    <img
      className="inline"
      title={`${league} league`}
      width={height ?? 60}
      alt={`${league} league`}
      src={`/images/${league.toLowerCase().replace(" ", "-")}.png`}
    />
  );
};
