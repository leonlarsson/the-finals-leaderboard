import { SearchNavLinks } from "./SearchNavLinks";
import { ReactNode } from "react";

export const PageWrapper = ({
  children,
  backLink,
  excludeSearchLink,
}: {
  children: ReactNode;
  backLink: ReactNode;
  excludeSearchLink?: "players" | "clubs";
}) => (
  <div className="my-4 flex flex-col gap-6">
    <div className="flex items-center gap-4">
      {backLink}
      <SearchNavLinks exclude={excludeSearchLink} />
    </div>
    {children}
  </div>
);
