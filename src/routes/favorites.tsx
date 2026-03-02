import type { BaseUserWithExtras } from "@/types";
import { PageWrapper } from "@/components/PageWrapper";
import {
  PlayerResultCard,
  type PlayerResult,
} from "@/components/PlayerResultCard";
import { ClubResultCard, type ClubResult } from "@/components/ClubResultCard";
import { SearchSkeletons } from "@/components/SearchSkeletons";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import { clubsQueryOptions } from "@/queries";
import { Leaderboard, leaderboards } from "@/utils/leaderboards";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  StarIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";

export const Route = createFileRoute("/favorites")({
  component: RouteComponent,
});

const allLeaderboards = Object.values(leaderboards).filter(
  (lb) => lb.enabled,
) as Leaderboard[];

function RouteComponent() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { clubFavorites, isClubFavorite, toggleClubFavorite } =
    useClubFavorites();

  useEffect(() => {
    document.title = "Favorites · Enhanced Leaderboard – THE FINALS";
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, []);

  const queries = useQueries({
    queries: allLeaderboards.map((lb) => ({
      queryKey: ["leaderboard", lb.id],
      queryFn: () => lb.fetchData("crossplay") as Promise<BaseUserWithExtras[]>,
      staleTime: Infinity,
    })),
  }) as UseQueryResult<BaseUserWithExtras[]>[];

  const clubsQuery = useQuery(clubsQueryOptions);

  const isAllLoading = queries.every((q) => q.isLoading);

  const playerResults = useMemo<PlayerResult[]>(
    () =>
      favorites.map((name) => {
        const appearances = allLeaderboards
          .map((lb, i) => ({
            lb,
            user: queries[i].data?.find(
              (u) => u.name.toLowerCase() === name.toLowerCase(),
            ),
          }))
          .filter(
            (e): e is { lb: Leaderboard; user: BaseUserWithExtras } =>
              e.user !== undefined,
          );
        const firstUser = appearances[0]?.user;
        return {
          name,
          clubTag: firstUser?.clubTag,
          steamName: firstUser?.steamName ?? "",
          psnName: firstUser?.psnName ?? "",
          xboxName: firstUser?.xboxName ?? "",
          appearances,
          bestRank: appearances.length
            ? Math.min(...appearances.map((a) => a.user.rank))
            : Infinity,
        };
      }),
    [favorites, queries],
  );

  const clubResults = useMemo<ClubResult[]>(
    () =>
      clubFavorites
        .map((tag) => {
          const club = clubsQuery.data?.find(
            (c) => c.clubTag.toLowerCase() === tag.toLowerCase(),
          );
          if (!club) return null;
          return {
            ...club,
            bestRank: club.leaderboards.length
              ? Math.min(...club.leaderboards.map((lb) => lb.rank))
              : Infinity,
          };
        })
        .filter((c): c is ClubResult => c !== null),
    [clubFavorites, clubsQuery.data],
  );

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  if (favorites.length === 0 && clubFavorites.length === 0) {
    return (
      <PageWrapper backLink={backLink}>
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-medium">Favorites</div>
          <p className="text-neutral-500">
            You haven't saved any players or clubs yet.
          </p>
          <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              How to add favorites:
            </p>
            <ul className="flex flex-col gap-1.5 text-sm text-neutral-500">
              <li>• Search for a player or club and open their profile</li>
              <li>
                • Click the <StarIcon className="inline size-3" /> button on
                their profile page, or the{" "}
                <StarIcon className="inline size-3" /> in any search result
              </li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <Link to="/players">
                <UserRoundIcon className="size-4" />
                Search for players
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <Link to="/clubs">
                <UsersRoundIcon className="size-4" />
                Search for clubs
              </Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper backLink={backLink}>
      <div className="flex flex-col gap-6">
        <div className="text-2xl font-medium">Favorites</div>

        {favorites.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="mb-0 text-xl">Players</div>
            <div className="flex flex-col gap-3">
              {isAllLoading ? (
                <SearchSkeletons hideTop />
              ) : (
                playerResults.map((player) => (
                  <PlayerResultCard
                    key={player.name}
                    player={player}
                    isFavorited={isFavorite(player.name)}
                    onToggleFavorite={() => toggleFavorite(player.name)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {clubFavorites.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="mb-0 text-xl">Clubs</div>
            <div className="flex flex-col gap-3">
              {clubsQuery.isLoading ? (
                <SearchSkeletons hideTop />
              ) : (
                clubResults.map((club) => (
                  <ClubResultCard
                    key={club.clubTag}
                    club={club}
                    isFavorited={isClubFavorite(club.clubTag)}
                    onToggleFavorite={() => toggleClubFavorite(club.clubTag)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
