import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ListFilterIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { type ClubResult, ClubResultCard } from "@/components/ClubResultCard";
import { DataFreshnessNote } from "@/components/DataFreshnessNote";
import { PageWrapper } from "@/components/PageWrapper";
import { SearchInput } from "@/components/SearchInput";
import { SearchSkeletons } from "@/components/SearchSkeletons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import { type ClubApiClub, searchClubs } from "@/utils/clubApi";
import {
  defaultLeaderboardId,
  getSeasonGroup,
  Leaderboard,
  leaderboardIdsToPrefetch,
  leaderboards,
  seasonOrder,
  webIdToApiId,
} from "@/utils/leaderboards";

const searchSchema = z.object({
  q: z.string().optional(),
  lbs: z.string().array().optional(),
  all: z.coerce.boolean().optional(),
  exactMatch: z.coerce.boolean().optional(),
});

export const Route = createFileRoute("/clubs/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

// Only leaderboards with club data are relevant here
const clubLeaderboards = Object.values(leaderboards).filter(
  (lb) => lb.enabled && lb.features.includes("clubsPanel"),
) as Leaderboard[];

const clubLeaderboardsByGroup = (() => {
  const map = new Map<string, Leaderboard[]>();
  for (const lb of clubLeaderboards) {
    const g = getSeasonGroup(lb.id);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(lb);
  }
  return seasonOrder
    .filter((g) => map.has(g))
    .map((g) => ({ label: g, items: map.get(g)! }));
})();

const defaultLbIds = leaderboardIdsToPrefetch.filter((id) =>
  clubLeaderboards.some((lb) => lb.id === id),
) as string[];

const buildResults = (clubs: ClubApiClub[]): ClubResult[] =>
  clubs
    .map((club) => ({
      ...club,
      bestRank: club.leaderboards.length
        ? Math.min(...club.leaderboards.map((lb) => lb.clubRank))
        : Infinity,
    }))
    .sort((a, b) => a.bestRank - b.bestRank)
    .slice(0, 50);

function RouteComponent() {
  const { q, lbs: lbsParam, all, exactMatch } = Route.useSearch();
  const navigate = useNavigate();
  const { isClubFavorite, toggleClubFavorite } = useClubFavorites();

  const isAllSelected = Boolean(all);
  const isDefault = !lbsParam && !all;
  const selectedIds = isAllSelected
    ? new Set(clubLeaderboards.map((lb) => lb.id))
    : new Set(lbsParam ?? defaultLbIds);

  useEffect(() => {
    document.title = "Club Search · Enhanced Leaderboard – THE FINALS";
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, []);

  const hasQuery = Boolean(q?.trim()) && q!.trim().length >= 2;
  const leaderboardIdsToSearch = [...selectedIds].map(webIdToApiId).sort();
  const isExactMatch = Boolean(exactMatch);

  // Debounce filter changes so rapid checkbox toggles don't each fire their own request
  const filterKey = JSON.stringify({ leaderboardIdsToSearch, isExactMatch });
  const [debouncedFilterKey, setDebouncedFilterKey] = useState(filterKey);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilterKey(filterKey), 400);
    return () => clearTimeout(timer);
  }, [filterKey]);
  const debouncedFilters = useMemo(
    () =>
      JSON.parse(debouncedFilterKey) as {
        leaderboardIdsToSearch: string[];
        isExactMatch: boolean;
      },
    [debouncedFilterKey],
  );

  const query = useQuery({
    queryKey: [
      "clubsSearch",
      q,
      debouncedFilters.leaderboardIdsToSearch,
      debouncedFilters.isExactMatch,
    ],
    queryFn: ({ signal }) =>
      searchClubs(q!.trim(), {
        leaderboardIds: debouncedFilters.leaderboardIdsToSearch,
        exactMatch: debouncedFilters.isExactMatch,
        withMembers: true,
        signal,
      }),
    staleTime: Infinity,
    enabled: hasQuery,
  });

  const handleSubmit = (value: string) => {
    navigate({
      to: "/clubs",
      search: {
        q: value || undefined,
        lbs: lbsParam,
        all: all || undefined,
        exactMatch: exactMatch || undefined,
      },
    });
  };

  const handleToggleLb = (id: string, checked: boolean) => {
    if (!checked && selectedIds.size === 1) return;
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    const nextArr = [...next];
    const equalsDefault =
      nextArr.length === defaultLbIds.length &&
      nextArr.every((id) => defaultLbIds.includes(id));
    navigate({
      to: "/clubs",
      search: {
        q: q || undefined,
        lbs: equalsDefault ? undefined : nextArr,
        exactMatch: exactMatch || undefined,
      },
    });
  };

  const handleSelectAll = () => {
    navigate({
      to: "/clubs",
      search: {
        q: q || undefined,
        all: true,
        exactMatch: exactMatch || undefined,
      },
    });
  };

  const handleClearAll = () => {
    navigate({
      to: "/clubs",
      search: { q: q || undefined, exactMatch: exactMatch || undefined },
    });
  };

  const handleToggleExactMatch = (checked: boolean) => {
    navigate({
      to: "/clubs",
      search: {
        q: q || undefined,
        lbs: lbsParam,
        all: all || undefined,
        exactMatch: checked || undefined,
      },
    });
  };

  const isLoading = hasQuery && query.isLoading;
  const results = useMemo(
    () =>
      hasQuery && !isLoading && query.data ? buildResults(query.data) : [],
    [hasQuery, isLoading, query.data],
  );
  const isCapped = results.length === 50;

  const lbFilterLabel = isAllSelected
    ? "All leaderboards"
    : isDefault
      ? getSeasonGroup(defaultLeaderboardId)
      : `${selectedIds.size} leaderboard${selectedIds.size === 1 ? "" : "s"}`;

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  return (
    <PageWrapper backLink={backLink} excludeSearchLink="clubs">
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-medium">Club Search</div>
        <DataFreshnessNote />

        <div className="flex flex-col gap-2">
          <SearchInput
            initialValue={q ?? ""}
            placeholder={
              isExactMatch
                ? "Search clubs... (exact match)"
                : "Search clubs... (partial match)"
            }
            onSubmit={handleSubmit}
          />

          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-1.5 text-sm"
                >
                  <ListFilterIcon className="size-3.5" />
                  {lbFilterLabel}
                  <ChevronDownIcon className="size-3 text-neutral-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    <button
                      onClick={handleSelectAll}
                      className="flex flex-1 items-center rounded px-2 py-1.5 text-left text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      All
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="flex flex-1 items-center rounded px-2 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="my-1 border-t border-neutral-200 dark:border-neutral-700" />
                  <div className="max-h-72 overflow-y-auto">
                    {clubLeaderboardsByGroup.map((group) => (
                      <div key={group.label}>
                        <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {group.label}
                        </div>
                        {group.items.map((lb) => (
                          <label
                            key={lb.id}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >
                            <Checkbox
                              checked={selectedIds.has(lb.id)}
                              onCheckedChange={(v) =>
                                handleToggleLb(lb.id, Boolean(v))
                              }
                            />
                            {lb.name}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <label className="flex w-fit cursor-pointer items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900">
              <Checkbox
                checked={isExactMatch}
                onCheckedChange={(v) => handleToggleExactMatch(Boolean(v))}
              />
              Exact match
            </label>
          </div>
        </div>
      </div>

      {query.isError && <ErrorState onRetry={() => query.refetch()} />}
      {!query.isError && !hasQuery && <EmptyState />}
      {!query.isError && hasQuery && isLoading && <SearchSkeletons />}
      {!query.isError && hasQuery && !isLoading && results.length === 0 && (
        <NoResultsState query={q!} />
      )}
      {!query.isError && hasQuery && !isLoading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-neutral-500">
            {isCapped
              ? "Showing top 50 results — refine your search for more specific results"
              : `${results.length} club${results.length === 1 ? "" : "s"} found`}
          </div>
          {results.map((club) => (
            <ClubResultCard
              key={club.clubTag.toLowerCase()}
              club={club}
              isFavorited={isClubFavorite(club.clubTag)}
              onToggleFavorite={() => toggleClubFavorite(club.clubTag)}
            />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <SearchIcon className="size-10 text-neutral-300 dark:text-neutral-600" />
      <div className="font-medium text-neutral-500">Search for clubs</div>
      <p className="max-w-sm text-sm text-neutral-400">
        Enter a partial club tag above to find clubs in the top 10K of any
        leaderboard.
      </p>
    </div>
  );
};

const NoResultsState = ({ query }: { query: string }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-neutral-500">
        No clubs found for &ldquo;{query}&rdquo;
      </p>
      <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <p className="mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Suggestions:
        </p>
        <ul className="flex flex-col gap-1.5 text-sm text-neutral-500">
          <li>• Try a shorter search term</li>
          <li>• Check your spelling</li>
          <li>• Expand the leaderboard filter to search more data</li>
          <li>
            • The club may not have any members in the top 10K of any searched
            leaderboard
          </li>
        </ul>
      </div>
    </div>
  );
};

const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircleIcon className="size-5" />
        <span className="font-medium">Failed to load club data</span>
      </div>
      <p className="text-sm text-neutral-500">
        Something went wrong while fetching data. Please try again.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
};
