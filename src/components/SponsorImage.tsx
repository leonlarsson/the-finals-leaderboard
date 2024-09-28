type SponsorImageProps = {
  sponsor: string;
  useIcon?: boolean;
  size?: number;
};

export default ({
  sponsor,
  useIcon,
  size = useIcon ? 20 : 60,
}: SponsorImageProps) => {
  if (!["holtow", "iseul-t", "engimo"].includes(sponsor.toLowerCase())) {
    return null;
  }

  return (
    <img
      className="inline data-[sponsor='ENGIMO']:bg-brand-red data-[use-icon=true]:bg-inherit data-[sponsor='ENGIMO']:p-1 data-[use-icon=true]:p-0 dark:!bg-inherit dark:!p-0"
      data-sponsor={sponsor}
      data-use-icon={useIcon}
      draggable={false}
      title={`${sponsor} sponsor`}
      width={size}
      alt={`${sponsor} sponsor`}
      src={`/images/sponsors/sponsor-${sponsor.toLowerCase()}${useIcon ? "-icon" : ""}.png`}
    />
  );
};
