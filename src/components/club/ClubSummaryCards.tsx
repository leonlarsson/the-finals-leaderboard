import { Link } from "@tanstack/react-router";
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
import { splitPlayerName } from "@/utils/playerName";
import { ClubSearch } from "./clubSearch";
import { currentSeason } from "./clubSeason";
import { formatClubValue, isRankedSeasonLeaderboard } from "./clubValue";
import { useClubLeaderboard } from "./useClubLeaderboard";

type ClubSummaryCardsProps = {
  club: ClubApiClub;
  clubTag: string;
  /** Leaderboards the club has members on, in `leaderboards` order */
  memberLbIds: LeaderboardId[];
};

export const ClubSummaryCards = ({
  club,
  clubTag,
  memberLbIds,
}: ClubSummaryCardsProps) => {
  // Only ranked leaderboards, a #1 on a small event leaderboard would overstate the club
  const bestStanding = club.leaderboards
    .filter((lb) => {
      const webId = apiIdToWebId(lb.leaderboardId);
      return isRankedSeasonLeaderboard(webId);
    })
    .reduce<(typeof club.leaderboards)[number] | undefined>(
      // On a tie, the newest season
      (best, lb) =>
        !best ||
        lb.clubRank < best.clubRank ||
        (lb.clubRank === best.clubRank &&
          seasonOrder.indexOf(getSeasonGroup(apiIdToWebId(lb.leaderboardId))) <
            seasonOrder.indexOf(
              getSeasonGroup(apiIdToWebId(best.leaderboardId)),
            ))
          ? lb
          : best,
      undefined,
    );

  const currentSeasonStanding = club.leaderboards.find(
    (lb) => apiIdToWebId(lb.leaderboardId) === defaultLeaderboardId,
  );

  // The club's best player on the current season's ranked leaderboard
  const rankedQuery = useClubLeaderboard(
    memberLbIds.includes(defaultLeaderboardId)
      ? defaultLeaderboardId
      : undefined,
    clubTag,
  );
  const topPlayer = rankedQuery.data?.reduce<BaseUserWithExtras | undefined>(
    (best, user) => (!best || user.rank < best.rank ? user : best),
    undefined,
  );

  const oldestSeason = club.leaderboards
    .map((lb) => getSeasonGroup(apiIdToWebId(lb.leaderboardId)))
    .filter((season) => season !== "Other")
    .sort((a, b) => seasonOrder.indexOf(b) - seasonOrder.indexOf(a))[0];

  const clubRankTitle = (leaderboardName: string) =>
    `The club's rank among all clubs on ${leaderboardName}, by its members' combined total`;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <SummaryCard
        clubTag={clubTag}
        search={{}}
        title={
          bestStanding
            ? clubRankTitle(
                getSeasonGroup(apiIdToWebId(bestStanding.leaderboardId)),
              )
            : undefined
        }
        label="Best club rank"
        value={
          bestStanding ? `#${bestStanding.clubRank.toLocaleString("en")}` : "—"
        }
        detail={
          bestStanding
            ? getSeasonGroup(apiIdToWebId(bestStanding.leaderboardId))
            : "Not ranked"
        }
      />
      <SummaryCard
        clubTag={clubTag}
        search={{}}
        title={clubRankTitle(leaderboards[defaultLeaderboardId].name)}
        label={`${currentSeason} club rank`}
        value={
          currentSeasonStanding
            ? `#${currentSeasonStanding.clubRank.toLocaleString("en")}`
            : "—"
        }
        detail={
          currentSeasonStanding
            ? `${currentSeasonStanding.memberCount.toLocaleString("en")} in the top 10K · ${formatClubValue(defaultLeaderboardId, currentSeasonStanding.totalValue)}`
            : "Not ranked"
        }
      />
      <SummaryCard
        clubTag={clubTag}
        search={topPlayer ? { tab: "player-ranks" } : undefined}
        title={`The club's best player on ${leaderboards[defaultLeaderboardId].name}`}
        label="Top player"
        value={
          rankedQuery.isLoading
            ? "…"
            : topPlayer
              ? `#${topPlayer.rank.toLocaleString("en")}`
              : "—"
        }
        detail={
          topPlayer
            ? splitPlayerName(topPlayer.name).name
            : rankedQuery.isLoading
              ? undefined
              : `Not ranked in ${currentSeason}`
        }
      />
      <SummaryCard
        clubTag={clubTag}
        search={{}}
        label="Leaderboards"
        value={club.leaderboards.length.toLocaleString("en")}
        detail={oldestSeason ? `Since ${oldestSeason}` : undefined}
      />
    </div>
  );
};

const SummaryCard = ({
  clubTag,
  search,
  title,
  label,
  value,
  detail,
}: {
  clubTag: string;
  /** Links to this tab on the club page. Not clickable without it */
  search?: ClubSearch;
  title?: string;
  label: string;
  value: string;
  detail?: string;
}) => {
  const className =
    "flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800";
  const content = (
    <>
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
      {detail && (
        <span
          className="truncate text-sm text-neutral-600 dark:text-neutral-400"
          title={detail}
        >
          {detail}
        </span>
      )}
    </>
  );

  if (!search) {
    return (
      <div className={className} title={title}>
        {content}
      </div>
    );
  }

  return (
    <Link
      to="/clubs/$clubTag"
      params={{ clubTag }}
      search={search}
      title={title}
      className={`${className} transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900`}
    >
      {content}
    </Link>
  );
};
