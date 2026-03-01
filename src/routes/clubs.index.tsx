import { clubsQueryOptions } from "@/queries";
import { panels } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  SearchIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

const SearchInput = ({
  initialValue,
  onSubmit,
}: {
  initialValue: string;
  onSubmit: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => onSubmit(inputValue.trim());

  return (
    <div className="flex gap-2">
      <Input
        type="search"
        ref={inputRef}
        className="max-w-sm"
        placeholder="Search clubs... (partial match)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        autoFocus
      />
      <Button onClick={handleSubmit}>
        <SearchIcon className="mr-2 size-4" />
        Search
      </Button>
    </div>
  );
};

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/clubs/")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

type ClubData = {
  clubTag: string;
  members: { name: string }[];
  leaderboards: { leaderboard: string; rank: number; totalValue: number }[];
};

type ClubResult = ClubData & { bestRank: number };

const buildResults = (data: ClubData[], q: string): ClubResult[] => {
  const normalizedQ = q.trim().toLowerCase();
  if (!normalizedQ) return [];
  return data
    .filter((c) => c.clubTag.toLowerCase().includes(normalizedQ))
    .map((c) => ({
      ...c,
      bestRank:
        c.leaderboards.length > 0
          ? Math.min(...c.leaderboards.map((lb) => lb.rank))
          : Infinity,
    }))
    .sort((a, b) => a.bestRank - b.bestRank)
    .slice(0, 50);
};

const apiIdToWebId = (lb: string): string =>
  ({
    s9: "season9",
    s9sponsor: "season9Sponsor",
    s9worldtour: "season9WorldTour",
    s9head2head: "season9Head2Head",
    s9powershift: "season9PowerShift",
    s9quickcash: "season9QuickCash",
    s9teamdeathmatch: "season9TeamDeathmatch",
    s9pointbreak: "season9PointBreak",
    s8: "season8",
    s8sponsor: "season8Sponsor",
    s8worldtour: "season8WorldTour",
    s8head2head: "season8Head2Head",
    s8powershift: "season8PowerShift",
    s8quickcash: "season8QuickCash",
    s8teamdeathmatch: "season8TeamDeathmatch",
    s8heavenorelse: "season8HeavenOrElse",
    s8ghoulrush: "season8GhoulRush",
    s8blastoff: "season8BlastOff",
    s7: "season7",
    s7sponsor: "season7Sponsor",
    s7worldtour: "season7WorldTour",
    s7terminalattack: "season7TerminalAttack",
    s7powershift: "season7PowerShift",
    s7quickcash: "season7QuickCash",
    s7teamdeathmatch: "season7TeamDeathmatch",
    s7blastoff: "season7BlastOff",
    s7cashball: "season7CashBall",
    s6: "season6",
    s6sponsor: "season6Sponsor",
    s6worldtour: "season6WorldTour",
    s6terminalattack: "season6TerminalAttack",
    s6powershift: "season6PowerShift",
    s6quickcash: "season6QuickCash",
    s6teamdeathmatch: "season6TeamDeathmatch",
    s6heavyhitters: "season6HeavyHitters",
    s5: "season5",
    s5sponsor: "season5Sponsor",
    s5worldtour: "season5WorldTour",
    s5terminalattack: "season5TerminalAttack",
    s5powershift: "season5PowerShift",
    s5quickcash: "season5QuickCash",
    s5bankit: "season5BankIt",
  })[lb] ?? lb;

function RouteComponent() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const query = useQuery(clubsQueryOptions);

  useEffect(() => {
    document.title = "Club Search · Enhanced Leaderboard – THE FINALS";
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, []);

  const hasQuery = Boolean(q?.trim());

  const handleSubmit = (value: string) => {
    navigate({
      to: "/clubs",
      search: { q: value || undefined },
    });
  };

  const results = useMemo(
    () => (hasQuery && query.data ? buildResults(query.data, q!) : []),
    [hasQuery, query.data, q],
  );

  const isCapped = results.length === 50;

  return (
    <div className="my-4 flex flex-col gap-6">
      <Link
        to="/"
        className="flex w-fit items-center gap-1 font-medium hover:underline"
      >
        <ArrowLeftIcon size={20} /> Back to leaderboards
      </Link>

      <div className="flex flex-col gap-4">
        <div className="text-2xl font-medium">Club Search</div>
        <SearchInput initialValue={q ?? ""} onSubmit={handleSubmit} />
      </div>

      {query.isError && <ErrorState onRetry={() => query.refetch()} />}
      {!query.isError && !hasQuery && <EmptyState />}
      {!query.isError && hasQuery && query.isLoading && <SearchSkeletons />}
      {!query.isError &&
        hasQuery &&
        !query.isLoading &&
        results.length === 0 && <NoResultsState query={q!} />}
      {!query.isError && hasQuery && !query.isLoading && results.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-neutral-500">
            {isCapped
              ? "Showing top 50 results — refine your search for more specific results"
              : `${results.length} club${results.length === 1 ? "" : "s"} found`}
          </div>
          {results.map((club) => (
            <ClubResultCard key={club.clubTag.toLowerCase()} club={club} />
          ))}
        </div>
      )}
    </div>
  );
}

const ClubResultCard = ({ club }: { club: ClubResult }) => {
  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/clubs/$clubTag"
          params={{ clubTag: club.clubTag }}
          className="flex min-w-0 items-center gap-1.5 font-medium hover:underline"
        >
          <UsersRoundIcon className="size-4 shrink-0 text-neutral-400" />
          <span>[{club.clubTag}]</span>
        </Link>
        <span className="shrink-0 text-sm text-neutral-500">
          {club.members.length.toLocaleString("en")}{" "}
          {club.members.length === 1 ? "member" : "members"} in top 10K
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {club.leaderboards.map((lb) => (
          <LeaderboardBadge
            key={lb.leaderboard}
            lb={lb}
            clubTag={club.clubTag}
          />
        ))}
      </div>
    </div>
  );
};

const LeaderboardBadge = ({
  lb,
  clubTag,
}: {
  lb: { leaderboard: string; rank: number; totalValue: number };
  clubTag: string;
}) => {
  const webId = apiIdToWebId(lb.leaderboard);
  const lbName =
    Object.values(leaderboards).find((x) => x.id === webId)?.name ??
    lb.leaderboard;

  return (
    <Link
      to="/"
      search={{
        lb: webId as LeaderboardId,
        panel: panels.CLUBS,
        clubTag: `exactCt:${clubTag}`,
      }}
      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
    >
      <span className="text-neutral-500">{lbName}</span>
      <span className="font-semibold">#{lb.rank.toLocaleString("en")}</span>
    </Link>
  );
};

const SearchSkeletons = () => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="flex items-center gap-2">
            <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-700" />
          </div>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="h-5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

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
          <li>
            • The club may not have any members in the top 10K of any
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
