import { InfoIcon } from "lucide-react";

export const DataFreshnessNote = () => (
  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
    <InfoIcon className="size-3.5 shrink-0" />
    <span>Data can be up to 4 hours old.</span>
  </div>
);
