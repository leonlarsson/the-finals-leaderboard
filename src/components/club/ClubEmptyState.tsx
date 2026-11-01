import { LucideIcon } from "lucide-react";

/** Empty state for a whole tab, the same style as the club search page */
export const ClubEmptyState = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-3 py-12 text-center">
    <Icon className="size-10 text-neutral-300 dark:text-neutral-600" />
    <div className="font-medium text-neutral-500">{title}</div>
    <p className="max-w-sm text-sm text-neutral-400">{description}</p>
  </div>
);
