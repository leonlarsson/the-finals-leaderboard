export default (sponsor: string, height?: number) => {
  if (!["holtow", "iseul-t", "engimo"].includes(sponsor.toLowerCase())) {
    return null;
  }

  return (
    <img
      className="inline data-[sponsor='ENGIMO']:bg-brand-red data-[sponsor='ENGIMO']:p-1 dark:!bg-inherit"
      data-sponsor={sponsor}
      draggable={false}
      title={`${sponsor} sponsor`}
      width={height ?? 60}
      alt={`${sponsor} sponsor`}
      src={`/images/sponsor-${sponsor.toLowerCase()}.png`}
    />
  );
};
