import { Link } from "@tanstack/react-router";
import { ChevronUp, ExternalLinkIcon, TrophyIcon } from "lucide-react";
import { useMemo } from "react";
import { ErrorState } from "@/components/ErrorState";
import { LeaderboardCombobox } from "@/components/LeaderboardCombobox";
import { LeaderboardDataTable } from "@/components/tables/LeaderboardDataTable";
import { getLeaderboardTableColumns } from "@/components/tables/LeaderboardDataTableColumns";
import { BaseUserWithExtras, platforms } from "@/types";
import { ClubApiClub } from "@/utils/clubApi";
import {
  apiIdToWebId,
  getSeasonGroup,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";
import { splitPlayerName } from "@/utils/playerName";
import { ClubEmptyState } from "./ClubEmptyState";
import { CLUB_MEMBERS_PAGE_SIZE_KEY } from "./clubSearch";
import { currentSeason } from "./clubSeason";
import { formatClubValue, memberClubValue } from "./clubValue";
import { useClubLeaderboard } from "./useClubLeaderboard";

type ClubLeaderboardRanksViewProps = {
  club: ClubApiClub;
  clubTag: string;
  /** Leaderboards the club has members on, in `leaderboards` order */
  memberLbIds: LeaderboardId[];
  /** The selected leaderboard, undefined if the club has none */
  memberLbId: LeaderboardId | undefined;
  onSelectLeaderboard: (id: LeaderboardId) => void;
};

/** One leaderboard picked from the club's leaderboards, with all its members in full */
export const ClubLeaderboardRanksView = ({
  club,
  clubTag,
  memberLbIds,
  memberLbId,
  onSelectLeaderboard,
}: ClubLeaderboardRanksViewProps) => {
  const memberLbIdSet = useMemo(() => new Set(memberLbIds), [memberLbIds]);

  // Members of this club in the top 10K of the selected leaderboard, known before its data loads
  const memberLbMemberCount = club.leaderboards.find(
    (lb) => apiIdToWebId(lb.leaderboardId) === memberLbId,
  )?.memberCount;

  // Only the club's rows, filtered by the API instead of loading the whole leaderboard
  const memberLbQuery = useClubLeaderboard(memberLbId, clubTag);

  // TanStack Table expects a stable columns reference
  const memberColumns = useMemo(
    () =>
      memberLbId
        ? getLeaderboardTableColumns(memberLbId, platforms.CROSSPLAY)
        : [],
    [memberLbId],
  );

  const memberLbUsers = useMemo(
    () => memberLbQuery.data ?? [],
    [memberLbQuery.data],
  );

  // Biggest 24h climber on the selected leaderboard
  const climber = useMemo(() => {
    if (!memberLbId) return undefined;
    // Older seasons keep the last 24h change from when they ended, so only use it for the current season
    const hasLiveChange =
      getSeasonGroup(memberLbId) === currentSeason &&
      (leaderboards[memberLbId].tableColumns as string[]).includes("change");
    if (!hasLiveChange) return undefined;
    return memberLbUsers
      .filter((user) => user.change > 0)
      .reduce<BaseUserWithExtras | undefined>(
        (best, user) => (!best || user.change > best.change ? user : best),
        undefined,
      );
  }, [memberLbUsers, memberLbId]);

  // The club data's count shows right away, the table's own count once the leaderboard has loaded
  const memberCount = memberLbQuery.data
    ? memberLbUsers.length
    : (memberLbMemberCount ?? 0);

  if (!memberLbId) {
    return (
      <ClubEmptyState
        icon={TrophyIcon}
        title="No member data"
        description="None of this club's leaderboards can be shown here yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["select1", "select2"] as const)
          .filter((group) =>
            memberLbIds.some((id) => leaderboards[id].group === group),
          )
          .map((group) => (
            <LeaderboardCombobox
              key={group}
              group={group}
              currentLeaderboard={leaderboards[memberLbId]}
              onSelect={onSelectLeaderboard}
              availableIds={memberLbIdSet}
            />
          ))}
      </div>

      {memberLbQuery.isError ? (
        <ErrorState
          title="Failed to load leaderboard data"
          onRetry={() => memberLbQuery.refetch()}
        />
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-neutral-500">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                <span className="font-medium text-foreground">
                  {memberCount.toLocaleString("en")}
                </span>{" "}
                {memberCount === 1 ? "member is" : "members are"} in the top 10K
                of {leaderboards[memberLbId].name}.
              </span>
              {climber && (
                <span
                  className="inline-flex items-center gap-1 rounded bg-neutral-200 px-1 text-foreground dark:bg-neutral-800"
                  title="Biggest climber in the last 24 hours"
                >
                  <span className="text-neutral-500">Best 24h</span>
                  <span className="inline-flex items-center text-indigo-400 dark:text-indigo-300">
                    <ChevronUp className="size-4" />
                    {climber.change.toLocaleString("en")}
                  </span>
                  <Link
                    to="/players/$playerName"
                    params={{ playerName: climber.name }}
                    className="font-medium hover:underline"
                  >
                    {splitPlayerName(climber.name).name}
                  </Link>
                </span>
              )}
            </div>
            <Link
              to="/"
              search={{
                lb: memberLbId,
                name: `clubTag:${club.clubTag}`,
              }}
              className="flex items-center gap-1.5 font-medium text-foreground hover:underline"
            >
              View on main leaderboard
              <ExternalLinkIcon className="size-3.5 text-neutral-400" />
            </Link>
          </div>

          {memberLbQuery.data && (
            <ContributionSummary
              leaderboardId={memberLbId}
              users={memberLbUsers}
            />
          )}

          <LeaderboardDataTable
            key={memberLbId}
            leaderboardId={memberLbId}
            showToolbar={false}
            hidePaginationIfSinglePage
            pageSizeStorageKey={CLUB_MEMBERS_PAGE_SIZE_KEY}
            paginationType="members"
            queryState={{
              isLoading: memberLbQuery.isLoading,
              isRefetching: memberLbQuery.isRefetching,
            }}
            columns={memberColumns}
            data={memberLbUsers}
          />
        </div>
      )}
    </div>
  );
};

/** One line on how the members' combined value is spread across them */
const ContributionSummary = ({
  leaderboardId,
  users,
}: {
  leaderboardId: LeaderboardId;
  users: BaseUserWithExtras[];
}) => {
  const value = (user: BaseUserWithExtras) =>
    memberClubValue(leaderboardId, user);
  const total = users.reduce((sum, user) => sum + value(user), 0);
  if (users.length < 2 || total === 0) return null;

  const sorted = [...users].sort((a, b) => value(b) - value(a));
  const combined = (
    <span className="font-medium text-foreground">
      {formatClubValue(leaderboardId, total)}
    </span>
  );
  const percent = (value: number) => (
    <span className="font-medium text-foreground">
      {(value / total).toLocaleString("en", {
        style: "percent",
        maximumFractionDigits: 0,
      })}
    </span>
  );

  // With a handful of members the top one says the most, with many the top 5 together
  if (users.length <= 5) {
    const top = sorted[0];
    return (
      <p className="text-sm text-neutral-500">
        <Link
          to="/players/$playerName"
          params={{ playerName: top.name }}
          className="font-medium text-foreground hover:underline"
        >
          {splitPlayerName(top.name).name}
        </Link>{" "}
        accounts for {percent(value(top))} of these members' combined {combined}
        .
      </p>
    );
  }

  const topFive = sorted
    .slice(0, 5)
    .reduce((sum, user) => sum + value(user), 0);
  return (
    <p className="text-sm text-neutral-500">
      The top 5 account for {percent(topFive)} of these members' combined{" "}
      {combined}.
    </p>
  );
};
