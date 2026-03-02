import { SearchInput } from "@/components/SearchInput";
import { PageWrapper } from "@/components/PageWrapper";
import {
  PlayerResultCard,
  type PlayerResult,
} from "@/components/PlayerResultCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  defaultLeaderboardId,
  getSeasonGroup,
  Leaderboard,
  leaderboardIdsToPrefetch,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ListFilterIcon,
  SearchIcon,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { SearchSkeletons } from "@/components/SearchSkeletons";
import { useFavorites } from "@/hooks/useFavorites";
import type { BaseUserWithExtras } from "@/types";

const searchSchema = z.object({
  q: z.string().optional(),
  lbs: z.string().array().optional(),
  all: z.coerce.boolean().optional(),
  platforms: z.string().array().optional(),
});

export const Route = createFileRoute("/players/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

const allLeaderboards = Object.values(leaderboards).filter(
  (lb) => lb.enabled,
) as Leaderboard[];

const leaderboardsByGroup = (() => {
  const map = new Map<string, Leaderboard[]>();
  for (const lb of allLeaderboards) {
    const g = getSeasonGroup(lb.id);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(lb);
  }
  return seasonOrder
    .filter((g) => map.has(g))
    .map((g) => ({ label: g, items: map.get(g)! }));
})();

const defaultLbIds = leaderboardIdsToPrefetch as string[];

const namePlatformOptions = [
  { id: "name", label: "Embark" },
  { id: "steam", label: "Steam" },
  { id: "psn", label: "PlayStation" },
  { id: "xbox", label: "Xbox" },
] as const;

const allPlatformIds = namePlatformOptions.map((f) => f.id as string);

const buildResults = (
  lbsToSearch: Leaderboard[],
  queries: { data: unknown }[],
  q: string,
  platforms: string[],
): PlayerResult[] => {
  const normalizedQ = q.trim().toLowerCase();
  if (!normalizedQ) return [];

  const platformSet = new Set(platforms);
  const playerMap = new Map<string, PlayerResult>();

  lbsToSearch.forEach((lb, i) => {
    const data = queries[i].data as BaseUserWithExtras[] | undefined;
    if (!data) return;

    for (const user of data) {
      const matches =
        (platformSet.has("name") &&
          user.name.toLowerCase().includes(normalizedQ)) ||
        (platformSet.has("steam") &&
          user.steamName.toLowerCase().includes(normalizedQ)) ||
        (platformSet.has("psn") &&
          user.psnName.toLowerCase().includes(normalizedQ)) ||
        (platformSet.has("xbox") &&
          user.xboxName.toLowerCase().includes(normalizedQ));
      if (!matches) continue;

      const key = user.name.toLowerCase();
      let entry = playerMap.get(key);
      if (!entry) {
        entry = {
          name: user.name,
          clubTag: user.clubTag,
          steamName: user.steamName,
          psnName: user.psnName,
          xboxName: user.xboxName,
          appearances: [],
          bestRank: user.rank,
        };
        playerMap.set(key, entry);
      }
      entry.appearances.push({ lb, user });
      if (user.rank < entry.bestRank) entry.bestRank = user.rank;
      if (!entry.clubTag && user.clubTag) entry.clubTag = user.clubTag;
      if (!entry.steamName && user.steamName) entry.steamName = user.steamName;
      if (!entry.psnName && user.psnName) entry.psnName = user.psnName;
      if (!entry.xboxName && user.xboxName) entry.xboxName = user.xboxName;
    }
  });

  return Array.from(playerMap.values())
    .sort((a, b) => a.bestRank - b.bestRank)
    .slice(0, 50);
};

function RouteComponent() {
  const {
    q,
    lbs: lbsParam,
    all,
    platforms: platformsParam,
  } = Route.useSearch();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isAllSelected = Boolean(all);
  const isDefault = !lbsParam && !all;
  const selectedIds = isAllSelected
    ? new Set(allLeaderboards.map((lb) => lb.id))
    : new Set(lbsParam ?? defaultLbIds);

  const selectedPlatforms = new Set(platformsParam ?? allPlatformIds);

  useEffect(() => {
    document.title = "Player Search · Enhanced Leaderboard – THE FINALS";
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, []);

  const hasQuery = Boolean(q?.trim());

  const lbsToSearch = useMemo(() => {
    if (isAllSelected) return allLeaderboards;
    const ids = new Set(lbsParam ?? defaultLbIds);
    return allLeaderboards.filter((lb) => ids.has(lb.id));
  }, [isAllSelected, lbsParam]);

  const queries = useQueries({
    queries: lbsToSearch.map((lb) => ({
      queryKey: ["leaderboard", lb.id],
      queryFn: () => lb.fetchData("crossplay") as Promise<BaseUserWithExtras[]>,
      staleTime: Infinity,
      enabled: hasQuery,
    })),
  });

  const platformsToSearch = platformsParam ?? allPlatformIds;

  const handleSubmit = (value: string) => {
    navigate({
      to: "/players",
      search: {
        q: value || undefined,
        lbs: lbsParam,
        all: all || undefined,
        platforms: platformsParam,
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
      to: "/players",
      search: {
        q: q || undefined,
        lbs: equalsDefault ? undefined : nextArr,
        platforms: platformsParam,
      },
    });
  };

  const handleSelectAll = () => {
    navigate({
      to: "/players",
      search: { q: q || undefined, all: true, platforms: platformsParam },
    });
  };

  const handleClearAll = () => {
    navigate({
      to: "/players",
      search: { q: q || undefined, platforms: platformsParam },
    });
  };

  const handleSelectAllPlatforms = () => {
    navigate({
      to: "/players",
      search: { q: q || undefined, lbs: lbsParam, all: all || undefined },
    });
  };

  const handleTogglePlatform = (id: string, checked: boolean) => {
    if (!checked && selectedPlatforms.size === 1) return;
    const next = new Set(selectedPlatforms);
    if (checked) next.add(id);
    else next.delete(id);
    const nextArr = [...next];
    const equalsAll = nextArr.length === allPlatformIds.length;
    navigate({
      to: "/players",
      search: {
        q: q || undefined,
        lbs: lbsParam,
        all: all || undefined,
        platforms: equalsAll ? undefined : nextArr,
      },
    });
  };

  const isLoading = hasQuery && queries.some((q) => q.isLoading);
  const results = useMemo(
    () =>
      hasQuery && !isLoading
        ? buildResults(lbsToSearch, queries, q!, platformsToSearch)
        : [],
    [hasQuery, isLoading, lbsToSearch, queries, q, platformsToSearch],
  );
  const isCapped = results.length === 50;

  const lbFilterLabel = isAllSelected
    ? "All leaderboards"
    : isDefault
      ? getSeasonGroup(defaultLeaderboardId)
      : `${selectedIds.size} leaderboard${selectedIds.size === 1 ? "" : "s"}`;

  const platformFilterLabel = !platformsParam
    ? "All platforms"
    : selectedPlatforms.size === 1
      ? (namePlatformOptions.find((f) => selectedPlatforms.has(f.id))?.label ??
        "1 platform")
      : `${selectedPlatforms.size} platforms`;

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  return (
    <PageWrapper backLink={backLink} excludeSearchLink="players">
      <div className="flex flex-col gap-4">
        <div className="text-2xl font-medium">Player Search</div>

        <div className="flex flex-col gap-2">
          <SearchInput
            initialValue={q ?? ""}
            placeholder="Search players... (partial match)"
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
                    {leaderboardsByGroup.map((group) => (
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

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit gap-1.5 text-sm"
                >
                  <ListFilterIcon className="size-3.5" />
                  {platformFilterLabel}
                  <ChevronDownIcon className="size-3 text-neutral-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-40 p-1.5">
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5">
                    <button
                      onClick={handleSelectAllPlatforms}
                      className="flex flex-1 items-center rounded px-2 py-1.5 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="my-1 border-t border-neutral-200 dark:border-neutral-700" />
                  {namePlatformOptions.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Checkbox
                        checked={selectedPlatforms.has(platform.id)}
                        onCheckedChange={(v) =>
                          handleTogglePlatform(platform.id, Boolean(v))
                        }
                      />
                      {platform.label}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {!hasQuery && <EmptyState />}
      {hasQuery && isLoading && <SearchSkeletons />}
      {hasQuery && !isLoading && results.length === 0 && (
        <NoResultsState query={q!} />
      )}
      {hasQuery && !isLoading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-neutral-500">
            {isCapped
              ? "Showing top 50 results — refine your search for more specific results"
              : `${results.length} player${results.length === 1 ? "" : "s"} found`}
          </div>
          {results.map((player) => (
            <PlayerResultCard
              key={player.name.toLowerCase()}
              player={player}
              isFavorited={isFavorite(player.name)}
              onToggleFavorite={() => toggleFavorite(player.name)}
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
      <div className="font-medium text-neutral-500">Search for players</div>
      <p className="max-w-sm text-sm text-neutral-400">
        Enter a partial name above to find players. Use the filters to choose
        which leaderboards and platform names to search.
      </p>
    </div>
  );
};

const NoResultsState = ({ query }: { query: string }) => {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium text-neutral-500">
        No players found for &ldquo;{query}&rdquo;
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
            • The player may not be in the top 10K on any searched leaderboard
          </li>
        </ul>
      </div>
    </div>
  );
};
