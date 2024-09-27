export default (league: string, height?: number) => {
  return (
    <img
      className="inline"
      draggable={false}
      title={`${league} league`}
      width={height ?? 60}
      alt={`${league} league`}
      src={`/images/leagues/${league.toLowerCase().replace(" ", "-")}.png`}
    />
  );
};
