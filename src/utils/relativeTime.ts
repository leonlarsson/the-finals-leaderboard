const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const formatRelativeTime = (isoDate: string): string => {
  const diffMinutes = Math.round(
    (Date.now() - new Date(isoDate).getTime()) / 60_000,
  );
  if (Math.abs(diffMinutes) < 60) return rtf.format(-diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(-diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(-diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(-diffMonths, "month");

  return rtf.format(-Math.round(diffMonths / 12), "year");
};
