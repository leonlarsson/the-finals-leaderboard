import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircleIcon, ArrowLeftIcon, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { AppBarChart } from "@/components/AppBarChart";
import { DataFreshnessNote } from "@/components/DataFreshnessNote";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import { panels } from "@/types";
import { fetchClub } from "@/utils/clubApi";
import {
  apiIdToWebId,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";

export const Route = createFileRoute("/clubs/$clubTag")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clubTag } = Route.useParams();
  const { isClubFavorite, toggleClubFavorite } = useClubFavorites();
  const [standingsFilter, setStandingsFilter] = useState("");
  const [playersFilter, setPlayersFilter] = useState("");

  useEffect(() => {
    document.title = `[${clubTag}] · Enhanced Leaderboard – THE FINALS`;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [clubTag]);

  const query = useQuery({
    queryKey: ["club", clubTag],
    queryFn: ({ signal }) => fetchClub(clubTag, { withMembers: true, signal }),
    staleTime: 5 * 60 * 1000,
  });

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  if (query.isLoading) {
    return <PageWrapper backLink={backLink}>Loading club data...</PageWrapper>;
  }

  if (query.isError) {
    return (
      <PageWrapper backLink={backLink}>
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

  const club = query.data;

  if (!club) {
    return (
      <PageWrapper backLink={backLink}>
        Club not found. This means that there are no players in the top 10K in
        this club. Try again later.
      </PageWrapper>
    );
  }

  const favorited = isClubFavorite(clubTag);

  const filteredStandings = club.leaderboards.filter((lb) => {
    const name =
      leaderboards[apiIdToWebId(lb.leaderboardId) as LeaderboardId]?.name ??
      lb.leaderboardId;
    return name.toLowerCase().includes(standingsFilter.trim().toLowerCase());
  });

  const filteredMembers = club.members
    .filter((member) =>
      member.name.toLowerCase().includes(playersFilter.trim().toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageWrapper backLink={backLink}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-4xl font-medium">{club.clubTag}</div>
            <div className="mt-1 text-sm">
              <span className="font-medium">{club.clubTag}</span> has{" "}
              {club.members.length.toLocaleString("en")}{" "}
              {club.members.length === 1 ? "member" : "members"} in the top 10K
              of any leaderboard.
            </div>
            <div className="mt-2">
              <DataFreshnessNote />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleClubFavorite(clubTag)}
            className="shrink-0 gap-1.5"
            title={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <StarIcon
              className={`size-4 transition-colors ${favorited ? "fill-yellow-400 text-yellow-400" : ""}`}
            />
            <span className="hidden sm:inline">
              {favorited ? "Saved" : "Favorite"}
            </span>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {club.leaderboards.length >= 2 && (
            <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
              <div className="mb-1 text-lg font-medium">
                Rank across leaderboards
              </div>
              <p className="mb-2 text-neutral-500">Lower rank is better.</p>
              <AppBarChart
                data={[...club.leaderboards]
                  .sort((a, b) => b.clubRank - a.clubRank)
                  .map((lb) => ({
                    name:
                      leaderboards[
                        apiIdToWebId(lb.leaderboardId) as LeaderboardId
                      ]?.nameShort ?? lb.leaderboardId,
                    Rank: 10001 - lb.clubRank,
                  }))}
                dataKey="Rank"
                yAxisFormatter={(v) => `#${(10001 - v).toLocaleString("en")}`}
                tooltip={({ label, payload }) => {
                  const invertedRank = payload?.[0]?.value as
                    | number
                    | undefined;
                  const lb = club.leaderboards.find(
                    (l) =>
                      (leaderboards[
                        apiIdToWebId(l.leaderboardId) as LeaderboardId
                      ]?.nameShort ?? l.leaderboardId) === label,
                  );
                  const lbName =
                    leaderboards[
                      apiIdToWebId(lb?.leaderboardId ?? "") as LeaderboardId
                    ]?.name ?? label;
                  return (
                    <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                      <span className="font-medium">{lbName}</span>
                      {typeof invertedRank === "number" && (
                        <span>
                          Rank #{(10001 - invertedRank).toLocaleString("en")}
                        </span>
                      )}
                    </div>
                  );
                }}
              />
            </div>
          )}

          <div>
            <span className="font-medium">Club Standings:</span>
            {club.leaderboards.length > 0 && (
              <Input
                type="search"
                placeholder="Filter leaderboards..."
                className="mb-2 mt-1 max-w-xs"
                value={standingsFilter}
                onChange={(e) => setStandingsFilter(e.target.value)}
              />
            )}
            <div className="flex flex-col gap-1">
              {filteredStandings.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No leaderboards match &ldquo;{standingsFilter}&rdquo;.
                </p>
              ) : (
                filteredStandings.map((leaderboard) => (
                  <Link
                    key={leaderboard.leaderboardId}
                    to="/"
                    search={{
                      lb: apiIdToWebId(leaderboard.leaderboardId),
                      panel: panels.CLUBS,
                      clubTag: `exactCt:${club.clubTag}`,
                    }}
                    className="mr-1 w-fit rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    <span className="text-lg font-medium">
                      {leaderboards[
                        apiIdToWebId(leaderboard.leaderboardId) as LeaderboardId
                      ]?.name ??
                        `Unknown leaderboard (${leaderboard.leaderboardId})`}
                    </span>{" "}
                    | <span>Rank #{leaderboard.clubRank}</span> |{" "}
                    <span>
                      Combined points:{" "}
                      {leaderboard.totalValue.toLocaleString("en")}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <span className="font-medium">Club Players:</span>
          {club.members.length > 0 && (
            <Input
              type="search"
              placeholder="Filter players..."
              className="mb-2 mt-1 max-w-xs"
              value={playersFilter}
              onChange={(e) => setPlayersFilter(e.target.value)}
            />
          )}
          <div className="flex flex-wrap gap-1">
            {filteredMembers.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No players match &ldquo;{playersFilter}&rdquo;.
              </p>
            ) : (
              filteredMembers.map((member) => (
                <Link
                  key={member.name}
                  to="/players/$playerName"
                  params={{ playerName: member.name }}
                  className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  {member.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
