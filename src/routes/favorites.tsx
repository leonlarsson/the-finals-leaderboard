import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  StarIcon,
  TrophyIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { type ClubResult, ClubResultCard } from "@/components/ClubResultCard";
import { FavoriteStarButton } from "@/components/FavoriteStarButton";
import { PageWrapper } from "@/components/PageWrapper";
import {
  type PlayerResult,
  PlayerResultCard,
} from "@/components/PlayerResultCard";
import { SearchSkeletons } from "@/components/SearchSkeletons";
import { Button } from "@/components/ui/button";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import { useFavorites } from "@/hooks/useFavorites";
import { useLeaderboardFavorites } from "@/hooks/useLeaderboardFavorites";
import type { BaseUserWithExtras } from "@/types";
import { fetchClub } from "@/utils/clubApi";
import {
  apiIdToWebId,
  defaultLeaderboardId,
  Leaderboard,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";
import { modKeyLabel } from "@/utils/platform";
import { fetchPlayer } from "@/utils/playerApi";

export const Route = createFileRoute("/favorites")({
  component: RouteComponent,
});

function RouteComponent() {
  const { favorites, isFavorite, toggleFavorite, clearFavorites } =
    useFavorites();
  const {
    clubFavorites,
    isClubFavorite,
    toggleClubFavorite,
    clearClubFavorites,
  } = useClubFavorites();
  const {
    leaderboardFavorites,
    toggleLeaderboardFavorite,
    clearLeaderboardFavorites,
  } = useLeaderboardFavorites();

  useEffect(() => {
    document.title = "Favorites · Enhanced Leaderboard – THE FINALS";
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, []);

  const playerQueries = useQueries({
    queries: favorites.map((name) => ({
      queryKey: ["player", name],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchPlayer(name, { signal }),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const clubQueries = useQueries({
    queries: clubFavorites.map((tag) => ({
      queryKey: ["club", tag],
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchClub(tag, { withMembers: true, signal }),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isAllLoading =
    favorites.length > 0 && playerQueries.some((q) => q.isLoading);
  const isClubsLoading =
    clubFavorites.length > 0 && clubQueries.some((q) => q.isLoading);

  const playerResults = useMemo<PlayerResult[]>(
    () =>
      favorites.map((name, i) => {
        const data = playerQueries[i]?.data;
        const appearances = (data?.leaderboards ?? [])
          .map((entry) => {
            const webId = apiIdToWebId(entry.leaderboardId);
            const lb = leaderboards[webId as LeaderboardId] as
              | Leaderboard
              | undefined;
            return lb
              ? { lb, user: entry as unknown as BaseUserWithExtras }
              : undefined;
          })
          .filter(
            (e): e is { lb: Leaderboard; user: BaseUserWithExtras } =>
              e !== undefined,
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
    [favorites, playerQueries],
  );

  const leaderboardResults = useMemo(
    () =>
      leaderboardFavorites
        .map((id) => leaderboards[id] as Leaderboard | undefined)
        .filter((lb) => lb !== undefined),
    [leaderboardFavorites],
  );

  const clubResults = useMemo<ClubResult[]>(
    () =>
      clubFavorites
        .map((_, i) => {
          const club = clubQueries[i]?.data;
          if (!club) return null;
          return {
            ...club,
            bestRank: club.leaderboards.length
              ? Math.min(...club.leaderboards.map((lb) => lb.clubRank))
              : Infinity,
          };
        })
        .filter((c): c is ClubResult => c !== null),
    [clubFavorites, clubQueries],
  );

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  if (
    favorites.length === 0 &&
    clubFavorites.length === 0 &&
    leaderboardFavorites.length === 0
  ) {
    return (
      <PageWrapper backLink={backLink}>
        <div className="flex flex-col gap-6">
          <div className="text-2xl font-medium">Favorites</div>
          <p className="text-neutral-500">
            You haven't saved any players, clubs, or leaderboards yet.
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
              <li>
                • Click the <StarIcon className="inline size-3" /> next to a
                leaderboard in the leaderboard dropdown or the{" "}
                <kbd className="rounded border border-neutral-200 px-1 py-0.5 font-mono text-xs dark:border-neutral-700">
                  {modKeyLabel()} K
                </kbd>{" "}
                search
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
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <Link to="/">
                <TrophyIcon className="size-4" />
                Browse leaderboards
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
            <div className="flex items-center justify-between">
              <div className="mb-0 text-xl">Players</div>
              <button
                onClick={clearFavorites}
                className="text-sm text-neutral-400 hover:text-red-500"
              >
                Clear all
              </button>
            </div>
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
            <div className="flex items-center justify-between">
              <div className="mb-0 text-xl">Clubs</div>
              <button
                onClick={clearClubFavorites}
                className="text-sm text-neutral-400 hover:text-red-500"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {isClubsLoading ? (
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

        {leaderboardResults.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="mb-0 text-xl">Leaderboards</div>
              <button
                onClick={clearLeaderboardFavorites}
                className="text-sm text-neutral-400 hover:text-red-500"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {leaderboardResults.map((lb) => (
                <div
                  key={lb.id}
                  className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/"
                      search={{
                        lb:
                          lb.id === defaultLeaderboardId
                            ? undefined
                            : (lb.id as LeaderboardId),
                      }}
                      className="flex min-w-0 items-center gap-1.5 font-medium hover:underline"
                    >
                      <TrophyIcon className="size-4 shrink-0 text-neutral-400" />
                      <span>{lb.name}</span>
                    </Link>
                    <FavoriteStarButton
                      favorited
                      onToggle={() =>
                        toggleLeaderboardFavorite(lb.id as LeaderboardId)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
