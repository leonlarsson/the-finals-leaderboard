const base = "cursor-pointer rounded transition-colors";

const neutral =
  "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700";

// Official esports orgs get a distinct "verified" tint with a subtle outline
const official =
  "border border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25";

export const clubBadgeClass = (isOfficial: boolean) =>
  `${base} ${isOfficial ? official : neutral}`;
