import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  BarChartIcon,
  CheckIcon,
  GitCompareArrowsIcon,
  Link2Icon,
  PieChartIcon,
  StarIcon,
  TrophyIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ClubPageSkeleton } from "@/components/club/ClubPageSkeleton";
import { ClubPlayerRanksTab } from "@/components/club/ClubPlayerRanksTab";
import { ClubRankTab } from "@/components/club/ClubRankTab";
import { ClubRosterTab } from "@/components/club/ClubRosterTab";
import { ClubStatsTab } from "@/components/club/ClubStatsTab";
import { ClubSummaryCards } from "@/components/club/ClubSummaryCards";
import {
  ClubTab,
  clubTabs,
  PlayerRanksView,
  playerRanksViews,
} from "@/components/club/clubSearch";
import { currentSeason } from "@/components/club/clubSeason";
import {
  useClubLeaderboard,
  useClubLeaderboards,
} from "@/components/club/useClubLeaderboard";
import { DataFreshnessNote } from "@/components/DataFreshnessNote";
import { ErrorState } from "@/components/ErrorState";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClubFavorites } from "@/hooks/useClubFavorites";
import { CompareMode } from "@/types";
import { fetchClub } from "@/utils/clubApi";
import {
  apiIdToWebId,
  defaultLeaderboardId,
  getSeasonGroup,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";

// Invalid values (e.g. removed leaderboards) fall back to the defaults instead of erroring
const searchParamsSchema = z.object({
  tab: z.enum(clubTabs).optional().catch(undefined),
  view: z.enum(playerRanksViews).optional().catch(undefined),
  lb: z
    .enum(
      Object.values(leaderboards).map((x) => x.id) as [
        LeaderboardId,
        ...LeaderboardId[],
      ],
    )
    .optional()
    .catch(undefined),
});

export const Route = createFileRoute("/clubs/$clubTag")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  component: RouteComponent,
});

function RouteComponent() {
  const { clubTag } = Route.useParams();
  const {
    tab,
    view: viewParam,
    lb: selectedMemberLb,
  } = Route.useSearch({
    select: ({ tab, view, lb }) => ({
      tab: tab ?? "club-rank",
      view,
      lb,
    }),
  });
  const navigate = Route.useNavigate();
  const { isClubFavorite, toggleClubFavorite } = useClubFavorites();
  const [copied, setCopied] = useState(false);

  const query = useQuery({
    queryKey: ["club", clubTag],
    queryFn: ({ signal }) => fetchClub(clubTag, { withMembers: true, signal }),
    staleTime: Infinity,
  });

  // Member leaderboards: only leaderboards where the club has members in the top 10K
  // Kept in the same order as `leaderboards` (newest first)
  const memberLbIds = useMemo(() => {
    const clubLbIds = new Set(
      (query.data?.leaderboards ?? []).map((lb) =>
        apiIdToWebId(lb.leaderboardId),
      ),
    );
    return Object.values(leaderboards)
      .filter((lb) => lb.enabled && clubLbIds.has(lb.id))
      .map((lb) => lb.id as LeaderboardId);
  }, [query.data?.leaderboards]);

  const setSelectedMemberLb = (id: LeaderboardId) =>
    navigate({
      search: (prev) => ({
        ...prev,
        view: "leaderboard",
        lb: id === defaultLeaderboardId ? undefined : id,
      }),
    });

  // Current season leaderboards the club has members on, shared by the header and the tabs
  const seasonLbIds = useMemo(
    () => memberLbIds.filter((id) => getSeasonGroup(id) === currentSeason),
    [memberLbIds],
  );

  // A selected leaderboard, or a club with nothing this season, opens the "By leaderboard" view
  const defaultView = (lb: LeaderboardId | undefined): PlayerRanksView =>
    lb || seasonLbIds.length === 0 ? "leaderboard" : "season";
  const view = viewParam ?? defaultView(selectedMemberLb);
  const setPlayerRanksView = (newView: PlayerRanksView) =>
    navigate({
      search: (prev) => ({
        ...prev,
        view: newView === defaultView(prev.lb) ? undefined : newView,
      }),
    });

  // Members active this season, for the line under the club name.
  // Same requests as the Player ranks and Stats tabs, so they're shared
  const seasonQueries = useClubLeaderboards(seasonLbIds, clubTag);
  // Only shown when every request worked, a partial count would be wrong
  const activeMemberCount = seasonQueries.isSuccess
    ? new Set(
        seasonQueries.data.flatMap((rows) =>
          (rows ?? []).map((user) => user.name.toLowerCase()),
        ),
      ).size
    : undefined;

  // Official esports orgs (e.g. VGG, Vanguard Gaming) have their name on the leaderboard rows, not in the club data.
  // Clubs without this season's data use their first leaderboard, the same request as the By leaderboard view
  const fallbackLbQuery = useClubLeaderboard(
    seasonLbIds.length === 0 ? memberLbIds[0] : undefined,
    clubTag,
  );
  const foundClubName = [...seasonQueries.data, fallbackLbQuery.data]
    .flatMap((rows) => rows ?? [])
    .find((user) => user.officialClubName)?.officialClubName;
  // Some names are just the tag (e.g. TSM), which would show it twice
  const officialClubName =
    foundClubName?.toLowerCase() === clubTag.toLowerCase()
      ? undefined
      : foundClubName;

  useEffect(() => {
    const name = officialClubName
      ? `${officialClubName} [${clubTag}]`
      : `[${clubTag}]`;
    document.title = `${name} · Enhanced Leaderboard – THE FINALS`;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [clubTag, officialClubName]);

  const memberLbId =
    selectedMemberLb && memberLbIds.includes(selectedMemberLb)
      ? selectedMemberLb
      : memberLbIds.includes(defaultLeaderboardId)
        ? defaultLeaderboardId
        : memberLbIds[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const backLink = (
    <Link
      to="/"
      className="flex w-fit items-center gap-1 font-medium hover:underline"
    >
      <ArrowLeftIcon size={20} /> Back to leaderboards
    </Link>
  );

  if (query.isLoading) {
    return (
      <PageWrapper backLink={backLink}>
        <ClubPageSkeleton />
      </PageWrapper>
    );
  }

  if (query.isError) {
    return (
      <PageWrapper backLink={backLink}>
        <ErrorState
          title="Failed to load club data"
          onRetry={() => query.refetch()}
        />
      </PageWrapper>
    );
  }

  const club = query.data;

  if (!club) {
    return (
      <PageWrapper backLink={backLink}>
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-1 break-all text-2xl font-medium">
              [{clubTag}]
            </div>
            <p className="text-neutral-500">
              Club not found. This means that there are no players in the top
              10K in this club. Check the tag or search for the club.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/clubs">Search clubs</Link>
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const favorited = isClubFavorite(clubTag);

  return (
    <PageWrapper backLink={backLink}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {officialClubName ? (
              // Wraps instead of truncating, the name is the point on phones too
              <div className="flex flex-wrap items-baseline gap-x-2 break-words text-3xl font-medium sm:text-4xl">
                <span className="min-w-0">{officialClubName}</span>
                <span className="font-normal text-neutral-500">
                  {club.clubTag}
                </span>
              </div>
            ) : (
              <div className="truncate text-3xl font-medium sm:text-4xl">
                {club.clubTag}
              </div>
            )}
            <div className="mt-1 text-sm text-neutral-500">
              <span className="font-medium text-foreground">
                {club.members.length.toLocaleString("en")}
              </span>{" "}
              {club.members.length === 1 ? "member" : "members"} all-time
              {activeMemberCount !== undefined &&
                (activeMemberCount > 0 ? (
                  <>
                    {" · "}
                    <span className="font-medium text-foreground">
                      {activeMemberCount.toLocaleString("en")}
                    </span>{" "}
                    active in {currentSeason}
                  </>
                ) : (
                  ` · not active in ${currentSeason}`
                ))}
            </div>
            <div className="mt-2">
              <DataFreshnessNote />
            </div>
          </div>
          {/* Action buttons */}
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link
                to="/compare"
                search={{ clubs: [club.clubTag], mode: CompareMode.Clubs }}
              >
                <GitCompareArrowsIcon className="size-4" />
                <span className="sr-only sm:not-sr-only">Compare</span>
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
                  <span className="sr-only sm:not-sr-only">Copied!</span>
                </>
              ) : (
                <>
                  <Link2Icon className="size-4" />
                  <span className="sr-only sm:not-sr-only">Share</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleClubFavorite(clubTag)}
              className="gap-1.5"
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon
                className={`size-4 transition-colors ${favorited ? "fill-yellow-400 text-yellow-400" : ""}`}
              />
              <span className="sr-only sm:not-sr-only">
                {favorited ? "Saved" : "Favorite"}
              </span>
            </Button>
          </div>
        </div>

        <ClubSummaryCards
          club={club}
          clubTag={clubTag}
          memberLbIds={memberLbIds}
        />

        <div className="space-y-3">
          <Tabs
            className="select-none"
            value={tab}
            onValueChange={(value) =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  tab: value === "club-rank" ? undefined : (value as ClubTab),
                }),
              })
            }
          >
            <TabsList>
              <TabsTrigger value="club-rank">
                <BarChartIcon className="inline size-5 sm:mr-2" />
                <span className="sr-only whitespace-nowrap sm:not-sr-only">
                  Club rank
                </span>
              </TabsTrigger>
              <TabsTrigger value="player-ranks">
                <TrophyIcon className="inline size-5 sm:mr-2" />
                <span className="sr-only whitespace-nowrap sm:not-sr-only">
                  Player ranks
                </span>
              </TabsTrigger>
              <TabsTrigger value="stats">
                <PieChartIcon className="inline size-5 sm:mr-2" />
                <span className="sr-only whitespace-nowrap sm:not-sr-only">
                  Stats
                </span>
              </TabsTrigger>
              <TabsTrigger value="roster">
                <UsersRoundIcon className="inline size-5 sm:mr-2" />
                <span className="sr-only whitespace-nowrap sm:not-sr-only">
                  Roster
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Keyed by club so filters and sorting reset when switching clubs */}
          {tab === "club-rank" && (
            <ClubRankTab
              key={clubTag}
              club={club}
              clubTag={clubTag}
              memberLbIds={memberLbIds}
            />
          )}
          {tab === "player-ranks" && (
            <ClubPlayerRanksTab
              key={clubTag}
              club={club}
              clubTag={clubTag}
              memberLbIds={memberLbIds}
              seasonLbIds={seasonLbIds}
              memberLbId={memberLbId}
              view={view}
              onSelectView={setPlayerRanksView}
              onSelectLeaderboard={setSelectedMemberLb}
            />
          )}
          {tab === "stats" && (
            <ClubStatsTab
              key={clubTag}
              club={club}
              clubTag={clubTag}
              memberLbIds={memberLbIds}
              seasonLbIds={seasonLbIds}
            />
          )}
          {tab === "roster" && <ClubRosterTab key={clubTag} club={club} />}
        </div>
      </div>
    </PageWrapper>
  );
}
