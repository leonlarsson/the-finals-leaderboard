import { clubsQueryOptions } from "@/queries";
import { panels } from "@/types";
import {
  apiIdToWebId,
  leaderboards,
  LeaderboardId,
} from "@/utils/leaderboards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SearchNavLinks } from "@/components/SearchNavLinks";
import { AlertCircleIcon, ArrowLeftIcon } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/clubs/$clubTag")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clubTag } = Route.useParams();

  useEffect(() => {
    document.title = `[${clubTag}] · Enhanced Leaderboard – THE FINALS`;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [clubTag]);

  const query = useQuery(clubsQueryOptions);

  if (query.isLoading) {
    return <PageWrapper>Loading a lot of data...</PageWrapper>;
  }

  if (query.isError || !query.data) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircleIcon className="size-5" />
            <span className="font-medium">Failed to load club data</span>
          </div>
          <p className="text-sm text-neutral-500">
            Something went wrong while fetching data. Please try again.
          </p>
          <Button variant="outline" size="sm" onClick={() => query.refetch()}>
            Try again
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const club = query.data.find(
    (x) => x.clubTag.toLowerCase() === clubTag.toLowerCase(),
  );

  if (!club) {
    return (
      <PageWrapper>
        Club not found. This means that there are no players in the top 10K in
        this club. Try again later.
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <div>
          Club Page
          <div className="text-4xl font-medium">{club.clubTag}</div>
          <div>
            <span className="font-medium">{club.clubTag}</span> has{" "}
            {club.members.length.toLocaleString("en")}{" "}
            {club.members.length === 1 ? "member" : "members"} in the top 10K of
            any leaderboard.
          </div>
        </div>

        <div>
          <span className="font-medium">Club Standings:</span>
          <div className="flex flex-col gap-1">
            {club.leaderboards.map(
              (leaderboard: {
                leaderboard: string;
                rank: number;
                totalValue: number;
              }) => (
                <Link
                  key={leaderboard.leaderboard}
                  to="/"
                  search={{
                    lb: apiIdToWebId(leaderboard.leaderboard),
                    panel: panels.CLUBS,
                    clubTag: `exactCt:${club.clubTag}`,
                  }}
                  className="mr-1 w-fit rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <span className="text-lg font-medium">
                    {leaderboards[
                      apiIdToWebId(leaderboard.leaderboard) as LeaderboardId
                    ]?.name ??
                      `Unknown leaderboard (${leaderboard.leaderboard})`}
                  </span>{" "}
                  | <span>Rank #{leaderboard.rank}</span> |{" "}
                  <span>
                    Combined points:{" "}
                    {leaderboard.totalValue.toLocaleString("en")}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>

        <div>
          <span className="font-medium">Club Players:</span>
          <div className="flex flex-wrap gap-1">
            {club.members
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member) => (
                <Link
                  key={member.name}
                  to="/players/$playerName"
                  params={{ playerName: member.name }}
                  className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  {member.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="my-4">
    <div className="mb-4 flex items-center gap-4">
      <Link
        to="/"
        search={(prev) => ({ ...prev, panel: panels.CLUBS })}
        className="flex w-fit items-center gap-1 font-medium hover:underline"
      >
        <ArrowLeftIcon size={20} /> Back to leaderboards
      </Link>
      <SearchNavLinks />
    </div>
    {children}
  </div>
);
