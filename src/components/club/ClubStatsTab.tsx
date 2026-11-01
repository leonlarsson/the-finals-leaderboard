import { ChevronDown, ChevronUp, PieChartIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AppBarChart } from "@/components/AppBarChart";
import { ErrorState } from "@/components/ErrorState";
import { PlayStationIcon, SteamIcon, XboxIcon } from "@/components/icons";
import { LeaderboardCombobox } from "@/components/LeaderboardCombobox";
import LeagueImage from "@/components/LeagueImage";
import { SponsorImage } from "@/components/SponsorImage";
import { BaseUserWithExtras } from "@/types";
import { ClubApiClub } from "@/utils/clubApi";
import {
  apiIdToWebId,
  defaultLeaderboardId,
  getSeasonGroup,
  LeaderboardId,
  leaderboards,
  seasonOrder,
} from "@/utils/leaderboards";
import leagues from "@/utils/leagues";
import { splitPlayerName } from "@/utils/playerName";
import { ClubEmptyState } from "./ClubEmptyState";
import { currentSeason, stripSeasonPrefix } from "./clubSeason";
import {
  clubRankChartScale,
  formatClubValue,
  isRankedSeasonLeaderboard,
} from "./clubValue";
import {
  ClubLeaderboardsResult,
  useClubLeaderboard,
  useClubLeaderboards,
} from "./useClubLeaderboard";

type ClubStatsTabProps = {
  club: ClubApiClub;
  clubTag: string;
  /** Leaderboards the club has members on, in `leaderboards` order */
  memberLbIds: LeaderboardId[];
  /** The current season's leaderboards out of `memberLbIds` */
  seasonLbIds: LeaderboardId[];
};

/** The club across seasons, and breakdowns of its members this season */
export const ClubStatsTab = ({
  club,
  clubTag,
  memberLbIds,
  seasonLbIds,
}: ClubStatsTabProps) => {
  // Same queries as the Player ranks tab, so switching between them is instant
  const queries = useClubLeaderboards(seasonLbIds, clubTag);

  // Works for clubs that aren't active this season too
  const seasonHistory = <ClubRankBySeason club={club} />;

  // Leagues and rank brackets can be picked per season, from the ranked leaderboards the club is on
  const rankedLbIds = useMemo(
    () =>
      memberLbIds.filter(
        (id) =>
          isRankedSeasonLeaderboard(id) &&
          (leagues as Record<string, string[] | undefined>)[id] !== undefined,
      ),
    [memberLbIds],
  );
  const seasonBreakdown =
    rankedLbIds.length > 0 ? (
      <SeasonBreakdown clubTag={clubTag} rankedLbIds={rankedLbIds} />
    ) : null;

  return (
    <div className="flex flex-col gap-6">
      {seasonHistory}
      {seasonBreakdown}
      <CurrentSeasonStats seasonLbIds={seasonLbIds} queries={queries} />
    </div>
  );
};

/** The sections that need this season's leaderboards */
const CurrentSeasonStats = ({
  seasonLbIds,
  queries,
}: {
  seasonLbIds: LeaderboardId[];
  queries: ClubLeaderboardsResult;
}) => {
  if (seasonLbIds.length === 0) {
    return (
      <ClubEmptyState
        icon={PieChartIcon}
        title={`Not active in ${currentSeason}`}
        description={`No members are in the top 10K of a ${currentSeason} leaderboard, so there are no stats for this season.`}
      />
    );
  }

  if (queries.isError) {
    return (
      <ErrorState
        title="Failed to load leaderboard data"
        onRetry={queries.refetchFailed}
      />
    );
  }

  if (queries.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {[120, 320, 80].map((height, i) => (
          <div
            key={i}
            className="rounded-md bg-neutral-100 p-4 dark:bg-neutral-900/50"
          >
            <div className="h-5 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div className="mt-2 h-4 w-64 max-w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
            <div
              className="mt-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"
              style={{ height }}
            />
          </div>
        ))}
      </div>
    );
  }

  const rowsFor = (id: LeaderboardId | undefined) =>
    id ? (queries.data[seasonLbIds.indexOf(id)] ?? []) : [];

  const rankedRows = rowsFor(
    seasonLbIds.includes(defaultLeaderboardId)
      ? defaultLeaderboardId
      : undefined,
  );
  const sponsorRows = rowsFor(
    seasonLbIds.find((id) =>
      (leaderboards[id].tableColumns as string[]).includes("sponsor"),
    ),
  );
  const allRows = seasonLbIds.flatMap((id) => rowsFor(id));

  return (
    <>
      {rankedRows.some((user) => user.change !== undefined) && (
        <Movement rows={rankedRows} />
      )}
      <ModePopularity
        modes={seasonLbIds.map((id) => ({ id, members: rowsFor(id).length }))}
      />
      {sponsorRows.length > 0 && <SponsorSplit rows={sponsorRows} />}
      {allRows.length > 0 && <PlatformSplit rows={allRows} />}
    </>
  );
};

const StatsBox = ({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
    <div className="mb-1 text-lg font-medium">{title}</div>
    <p className="mb-2 text-neutral-500">{description}</p>
    {children}
  </div>
);

const LeagueChart = ({
  rows,
  leaderboardId,
}: {
  rows: BaseUserWithExtras[];
  leaderboardId: LeaderboardId;
}) => {
  const leagueNames =
    (leagues as Record<string, string[] | undefined>)[leaderboardId] ?? [];
  return (
    <AppBarChart
      className="h-[300px]"
      data={leagueNames.map((league) => ({
        name: league,
        Members: rows.filter((user) => user.league === league).length,
      }))}
      dataKey="Members"
      yAxisFormatter={(v) => v.toLocaleString("en")}
      allowDecimals={false}
      tooltip={({ label, payload }) => {
        const amount = payload?.[0]?.value as number | undefined;
        return (
          <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
            <div className="flex items-center gap-1">
              {/* The tooltip also renders without a hovered league */}
              {leagueNames.includes(label as string) && (
                <LeagueImage league={label as string} size={30} />
              )}
              <span className="font-medium">{label}</span>
            </div>
            {typeof amount === "number" && (
              <span>
                {amount.toLocaleString("en")}{" "}
                {amount === 1 ? "member" : "members"}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

const SponsorSplit = ({ rows }: { rows: BaseUserWithExtras[] }) => {
  const sponsors = Object.entries(
    rows.reduce<Record<string, { members: number; fans: number }>>(
      (acc, user) => {
        if (!user.sponsor) return acc;
        acc[user.sponsor] ??= { members: 0, fans: 0 };
        acc[user.sponsor].members += 1;
        acc[user.sponsor].fans += user.fans ?? 0;
        return acc;
      },
      {},
    ),
  ).sort(([, a], [, b]) => b.members - a.members || b.fans - a.fans);

  return (
    <StatsBox
      title="Sponsors"
      description="Which sponsors the club's members picked this season."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sponsors.map(([sponsor, { members, fans }]) => (
          <div
            key={sponsor}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black"
          >
            <SponsorImage sponsor={sponsor} size={48} />
            <div className="flex flex-col">
              <span className="font-medium">{sponsor}</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {members.toLocaleString("en")}{" "}
                {members === 1 ? "member" : "members"} ·{" "}
                {fans.toLocaleString("en")} fans
              </span>
            </div>
          </div>
        ))}
      </div>
    </StatsBox>
  );
};

const PlatformSplit = ({ rows }: { rows: BaseUserWithExtras[] }) => {
  // A member can show up on several leaderboards and link several platforms
  const platformsByMember = new Map<string, Set<string>>();
  for (const user of rows) {
    const key = user.name.toLowerCase();
    if (!platformsByMember.has(key)) platformsByMember.set(key, new Set());
    const memberPlatforms = platformsByMember.get(key)!;
    if (user.steamName) memberPlatforms.add("steam");
    if (user.xboxName) memberPlatforms.add("xbox");
    if (user.psnName) memberPlatforms.add("psn");
  }
  const count = (platform: string) =>
    Array.from(platformsByMember.values()).filter((set) => set.has(platform))
      .length;

  const platformCards = [
    { label: "Steam", icon: SteamIcon, members: count("steam") },
    { label: "Xbox", icon: XboxIcon, members: count("xbox") },
    { label: "PlayStation", icon: PlayStationIcon, members: count("psn") },
  ];

  return (
    <StatsBox
      title="Platforms"
      description="Linked platform accounts. Members can have more than one."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {platformCards.map(({ label, icon: Icon, members }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black"
          >
            <Icon className="size-6" />
            <div className="flex flex-col">
              <span className="font-medium">{label}</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {members.toLocaleString("en")}{" "}
                {members === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </StatsBox>
  );
};

/** A small number card inside a stats box */
const MiniStat = ({
  label,
  value,
  detail,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-black">
    <span className="font-medium text-neutral-500">{label}</span>
    <span className={`text-lg font-semibold ${valueClassName ?? ""}`}>
      {value}
    </span>
    {detail && (
      <span className="truncate text-neutral-600 dark:text-neutral-400">
        {detail}
      </span>
    )}
  </div>
);

/** The club's rank among all clubs on each season's ranked leaderboard, oldest season first */
const ClubRankBySeason = ({ club }: { club: ClubApiClub }) => {
  const seasons = club.leaderboards
    .map((lb) => ({ ...lb, webId: apiIdToWebId(lb.leaderboardId) }))
    .filter(({ webId }) => isRankedSeasonLeaderboard(webId))
    .sort(
      (a, b) =>
        seasonOrder.indexOf(getSeasonGroup(b.webId)) -
        seasonOrder.indexOf(getSeasonGroup(a.webId)),
    );

  // One season isn't a trend
  if (seasons.length < 2) return null;

  const rankScale = clubRankChartScale(
    seasons.map((season) => season.clubRank),
  );

  return (
    <StatsBox
      title="Club rank by season"
      description="The club's rank among all clubs on each season's ranked leaderboard. Lower rank is better."
    >
      <AppBarChart
        className="h-[300px]"
        data={seasons.map((season) => ({
          name: leaderboards[season.webId as LeaderboardId].nameShort,
          Rank: rankScale.toBarValue(season.clubRank),
        }))}
        dataKey="Rank"
        yAxisFormatter={rankScale.formatTick}
        valueDomain={rankScale.domain}
        allowDecimals={false}
        tooltip={({ label }) => {
          const season = seasons.find(
            (s) => leaderboards[s.webId as LeaderboardId].nameShort === label,
          );
          return (
            <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
              <span className="font-medium">
                {season ? getSeasonGroup(season.webId) : label}
              </span>
              {season && (
                <span>Club rank #{season.clubRank.toLocaleString("en")}</span>
              )}
              {season && (
                <span className="text-neutral-500">
                  {season.memberCount.toLocaleString("en")}{" "}
                  {season.memberCount === 1 ? "member" : "members"} ·{" "}
                  {formatClubValue(season.webId, season.totalValue)}
                </span>
              )}
            </div>
          );
        }}
      />
    </StatsBox>
  );
};

/** How many ranked members are in the top 100, 500, 1K and 5K */
const RankBrackets = ({ rows }: { rows: BaseUserWithExtras[] }) => {
  // No top 10K bracket, it's always every member since only the top 10K has data
  const brackets = [100, 500, 1_000, 5_000];
  const scores = rows
    .map((user) => user.rankScore ?? user.fame)
    .filter((score): score is number => score !== undefined && score !== null);
  const bestScore = scores.length ? Math.max(...scores) : undefined;
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : undefined;

  return (
    <div>
      <div className="mb-2 font-medium">Rank brackets</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {brackets.map((bracket) => (
          <MiniStat
            key={bracket}
            label={`Top ${bracket >= 1_000 ? `${bracket / 1_000}K` : bracket}`}
            value={rows
              .filter((user) => user.rank <= bracket)
              .length.toLocaleString("en")}
          />
        ))}
      </div>
      {bestScore !== undefined && averageScore !== undefined && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MiniStat
            label="Best rank score"
            value={bestScore.toLocaleString("en")}
          />
          <MiniStat
            label="Average rank score"
            value={averageScore.toLocaleString("en")}
          />
        </div>
      )}
    </div>
  );
};

/** How the ranked members moved in the last 24 hours */
const Movement = ({ rows }: { rows: BaseUserWithExtras[] }) => {
  // The change is the rank change on the game's full leaderboard, so it also covers players
  // that were outside the top 10K yesterday
  const climbed = rows.filter((user) => user.change > 0);
  const dropped = rows.filter((user) => user.change < 0);
  const biggestClimb = climbed.reduce<BaseUserWithExtras | undefined>(
    (best, user) => (!best || user.change > best.change ? user : best),
    undefined,
  );
  const biggestDrop = dropped.reduce<BaseUserWithExtras | undefined>(
    (worst, user) => (!worst || user.change < worst.change ? user : worst),
    undefined,
  );

  const up = "text-indigo-400 dark:text-indigo-300";
  const down = "text-red-500";

  return (
    <StatsBox
      title="Last 24 hours"
      description={`How the club's members moved on ${leaderboards[defaultLeaderboardId].name}.`}
    >
      {/* No "unchanged" count: ranks shift whenever others play, so it's practically always 0.
          No summed change either: one jump from outside the top 10K outweighs everyone else */}
      <div className="grid grid-cols-2 gap-3">
        <MiniStat
          label="Climbed"
          value={climbed.length.toLocaleString("en")}
          valueClassName={climbed.length > 0 ? up : undefined}
        />
        <MiniStat
          label="Dropped"
          value={dropped.length.toLocaleString("en")}
          valueClassName={dropped.length > 0 ? down : undefined}
        />
      </div>
      {(biggestClimb || biggestDrop) && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {biggestClimb && (
            <MiniStat
              label="Biggest climb"
              value={
                <span className={`inline-flex items-center ${up}`}>
                  <ChevronUp className="size-5" />
                  {biggestClimb.change.toLocaleString("en")}
                </span>
              }
              detail={splitPlayerName(biggestClimb.name).name}
            />
          )}
          {biggestDrop && (
            <MiniStat
              label="Biggest drop"
              value={
                <span className={`inline-flex items-center ${down}`}>
                  <ChevronDown className="size-5" />
                  {Math.abs(biggestDrop.change).toLocaleString("en")}
                </span>
              }
              detail={splitPlayerName(biggestDrop.name).name}
            />
          )}
        </div>
      )}
    </StatsBox>
  );
};

/** How many members are in the top 10K of each current season leaderboard */
const ModePopularity = ({
  modes,
}: {
  modes: { id: LeaderboardId; members: number }[];
}) => {
  if (modes.length < 2) return null;
  const sorted = [...modes].sort((a, b) => b.members - a.members);

  return (
    <StatsBox
      title="Leaderboards"
      description={`Members in the top 10K of each ${currentSeason} leaderboard.`}
    >
      <AppBarChart
        orientation="bars"
        className="h-[320px]"
        data={sorted.map(({ id, members }) => ({
          name: stripSeasonPrefix(leaderboards[id].name, currentSeason),
          Members: members,
        }))}
        dataKey="Members"
        xAxisFormatter={(v) => v.toLocaleString("en")}
        allowDecimals={false}
        yAxisWidth={130}
        tooltip={({ label, payload }) => {
          const amount = payload?.[0]?.value as number | undefined;
          return (
            <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
              <span className="font-medium">{label}</span>
              {typeof amount === "number" && (
                <span>
                  {amount.toLocaleString("en")}{" "}
                  {amount === 1 ? "member" : "members"}
                </span>
              )}
            </div>
          );
        }}
      />
    </StatsBox>
  );
};

/** Leagues and rank brackets for one season, picked in the box title like the main Clubs panel */
const SeasonBreakdown = ({
  clubTag,
  rankedLbIds,
}: {
  clubTag: string;
  /** Ranked season leaderboards the club has data on, newest first */
  rankedLbIds: LeaderboardId[];
}) => {
  const [selectedLbId, setSelectedLbId] = useState<LeaderboardId>(
    rankedLbIds.includes(defaultLeaderboardId)
      ? defaultLeaderboardId
      : rankedLbIds[0],
  );
  const rankedLbIdSet = useMemo(() => new Set(rankedLbIds), [rankedLbIds]);
  // The current season is the same request as the other tabs, older ones load when picked
  const query = useClubLeaderboard(selectedLbId, clubTag);
  const rows = query.data ?? [];
  const seasonName = leaderboards[selectedLbId].name;

  return (
    <StatsBox
      title={
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <LeaderboardCombobox
            currentLeaderboard={leaderboards[selectedLbId]}
            onSelect={setSelectedLbId}
            availableIds={rankedLbIdSet}
          />
          <span>leagues and ranks</span>
        </div>
      }
      description={
        query.data
          ? `${rows.length.toLocaleString("en")} ${rows.length === 1 ? "member" : "members"} in the top 10K of ${seasonName}.`
          : `Members in the top 10K of ${seasonName}.`
      }
    >
      {query.isError ? (
        <ErrorState
          title="Failed to load leaderboard data"
          onRetry={() => query.refetch()}
        />
      ) : query.isLoading ? (
        <div className="h-[420px] animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700" />
      ) : (
        <div className="flex flex-col gap-6">
          <LeagueChart rows={rows} leaderboardId={selectedLbId} />
          <RankBrackets rows={rows} />
        </div>
      )}
    </StatsBox>
  );
};
