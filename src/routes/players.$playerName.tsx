import { BarChart } from "@tremor/react";
import type { BaseUserWithExtras } from "@/types";
import { PageWrapper } from "@/components/PageWrapper";
import { SeasonSection, SkeletonCard } from "@/components/StatCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import {
  defaultLeaderboard,
  getSeasonGroup,
  Leaderboard,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckIcon,
  GitCompareArrowsIcon,
  History,
  Link2Icon,
  Loader2Icon,
  StarIcon,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/players/$playerName")({
  component: RouteComponent,
});

const allLeaderboards = Object.values(leaderboards).filter(
  (lb) => lb.enabled,
) as Leaderboard[];

const defaultLeaderboardName = defaultLeaderboard.name;

function RouteComponent() {
  const { playerName } = Route.useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = `${playerName} · Enhanced Leaderboard – THE FINALS`;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [playerName]);

  const queries = useQueries({
    queries: allLeaderboards.map((lb) => ({
      queryKey: ["leaderboard", lb.id],
      queryFn: () => lb.fetchData("crossplay") as Promise<BaseUserWithExtras[]>,
      staleTime: Infinity,
    })),
  });

  const isAllLoading = queries.every((q) => q.isLoading);
  const isAllError = queries.every((q) => q.isError);
  const someLoading = queries.some((q) => q.isLoading);

  const backLink = (
    <Link
      to="/"
      search={{ name: playerName }}
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isAllLoading) {
    return (
      <PageWrapper backLink={backLink}>
        <PlayerHeader />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageWrapper>
    );
  }

  if (isAllError) {
    return (
      <PageWrapper backLink={backLink}>
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircleIcon className="size-5" />
            <span className="font-medium">Failed to load player data</span>
          </div>
          <p className="text-sm text-neutral-500">
            Something went wrong while fetching leaderboard data. Please try
            again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["leaderboard"] })
            }
          >
            Try again
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const playerEntries = allLeaderboards
    .map((lb, i) => ({
      lb,
      user: (queries[i].data as BaseUserWithExtras[] | undefined)?.find(
        (u) => u.name.toLowerCase() === playerName.toLowerCase(),
      ),
    }))
    .filter(
      (e): e is { lb: Leaderboard; user: BaseUserWithExtras } =>
        e.user !== undefined,
    );

  const baseUser = playerEntries[0]?.user;
  const favorited = isFavorite(playerName);

  if (playerEntries.length === 0 && !someLoading) {
    return (
      <PageWrapper backLink={backLink}>
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-1 break-all text-2xl font-medium">
              {playerName}
            </div>
            <p className="text-neutral-500">
              This player wasn't found in the top 10,000 of any leaderboard.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Suggestions:
            </p>
            <ul className="flex flex-col gap-1.5 text-sm text-neutral-500">
              <li>• Check the spelling — names are case-insensitive</li>
              <li>
                • Make sure the full name is included, e.g.{" "}
                <span className="font-mono text-xs">Name#1234</span>
              </li>
              <li>• The player may not be in the top 10K on any leaderboard</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/" search={{ name: playerName }}>
                Search on main leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const grouped = new Map<string, typeof playerEntries>();
  for (const entry of playerEntries) {
    const group = getSeasonGroup(entry.lb.id);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(entry);
  }

  const sortedGroups = Array.from(grouped.entries()).sort(
    ([a], [b]) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b),
  );

  return (
    <PageWrapper backLink={backLink}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="truncate text-3xl font-medium sm:text-4xl">
              <span>{playerName.split("#")[0]}</span>
              <span className="text-neutral-500">
                #{playerName.split("#")[1]}
              </span>

              {someLoading && (
                <Loader2Icon className="inline size-5 animate-spin text-neutral-400" />
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              {baseUser?.clubTag && (
                <Link
                  to="/clubs/$clubTag"
                  params={{ clubTag: baseUser.clubTag }}
                  title="View club page"
                  className="rounded bg-neutral-200 px-1.5 py-0.5 font-medium transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  [{baseUser.clubTag}]
                </Link>
              )}
              {baseUser?.steamName && (
                <span className="text-neutral-500">
                  Steam: {baseUser.steamName}
                </span>
              )}
              {baseUser?.xboxName && (
                <span className="text-neutral-500">
                  Xbox: {baseUser.xboxName}
                </span>
              )}
              {baseUser?.psnName && (
                <span className="text-neutral-500">
                  PSN: {baseUser.psnName}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link to="/compare" search={{ players: [playerName] }}>
                <GitCompareArrowsIcon className="size-4" />
                <span className="hidden sm:inline">Compare</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5"
            >
              {copied ? (
                <>
                  <CheckIcon className="size-4 text-green-500" />
                  <span className="hidden sm:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Link2Icon className="size-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(playerName)}
              className="gap-1.5"
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
        </div>

        {/* Rank chart */}
        {playerEntries.length >= 2 && !someLoading && (
          <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
            <div className="mb-1 text-lg font-medium">
              Rank across leaderboards
            </div>
            <p className="mb-2 text-neutral-500">Lower rank is better.</p>
            <BarChart
              data={[...playerEntries]
                .sort((a, b) => b.user.rank - a.user.rank)
                .map(({ lb, user }) => ({
                  name: lb.nameShort,
                  Rank: 10001 - user.rank,
                }))}
              index="name"
              categories={["Rank"]}
              colors={["#d31f3c"]}
              valueFormatter={(v) => `#${(10001 - v).toLocaleString("en")}`}
              showAnimation
              animationDuration={400}
              customTooltip={({ label, payload }) => {
                const invertedRank = payload?.[0]?.value;
                const entry = playerEntries.find(
                  ({ lb }) => lb.nameShort === label,
                );
                return (
                  <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                    <span className="font-medium">
                      {entry?.lb.name ?? label}
                    </span>
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

        {/* Current season — always visible */}
        {sortedGroups
          .filter(([season]) => season === defaultLeaderboardName)
          .map(([season, entries]) => (
            <SeasonSection
              key={season}
              season={season}
              entries={entries}
              playerName={playerName}
              currentSeasonName={defaultLeaderboardName}
            />
          ))}

        {/* Older seasons — collapsible accordion */}
        {sortedGroups.some(([season]) => season !== defaultLeaderboardName) && (
          <div className="rounded-lg border border-neutral-200 px-4 dark:border-neutral-800">
            <div className="flex items-center gap-2 py-3">
              <History className="size-4 text-neutral-500" />
              <span className="text-sm font-semibold text-neutral-500">
                Previous Seasons
              </span>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {sortedGroups
                  .filter(([s]) => s !== defaultLeaderboardName)
                  .reduce((acc, [, e]) => acc + e.length, 0)}{" "}
                leaderboards
              </span>
            </div>
            <Accordion type="multiple" className="w-full">
              {sortedGroups
                .filter(([season]) => season !== defaultLeaderboardName)
                .map(([season, entries]) => (
                  <AccordionItem key={season} value={season}>
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                      <span className="flex items-center gap-2">
                        {season}
                        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-normal text-neutral-500 dark:bg-neutral-800">
                          {entries.length}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SeasonSection
                        season={season}
                        entries={entries}
                        playerName={playerName}
                        currentSeasonName={defaultLeaderboardName}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

const PlayerHeader = () => {
  return (
    <div className="mb-4">
      <div className="h-9 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 sm:h-10 sm:w-64" />
      <div className="mt-2 h-7 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
};
