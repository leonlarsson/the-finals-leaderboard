import { Link } from "@tanstack/react-router";
import { UsersRoundIcon } from "lucide-react";
import { FavoriteStarButton } from "@/components/FavoriteStarButton";
import { panels } from "@/types";
import type { ClubApiClub, ClubApiLeaderboardEntry } from "@/utils/clubApi";
import {
  apiIdToWebId,
  LeaderboardId,
  leaderboards,
} from "@/utils/leaderboards";

export type ClubResult = ClubApiClub & { bestRank: number };

export const ClubResultCard = ({
  club,
  isFavorited,
  onToggleFavorite,
}: {
  club: ClubResult;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}) => (
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

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm text-neutral-500">
          {club.members.length.toLocaleString("en")}{" "}
          {club.members.length === 1 ? "member" : "members"} in top 10K
        </span>
        {onToggleFavorite && (
          <FavoriteStarButton
            favorited={!!isFavorited}
            onToggle={onToggleFavorite}
          />
        )}
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-1.5">
      {/* Already sorted from API */}
      {club.leaderboards.map((lb) => (
        <LeaderboardBadge
          key={lb.leaderboardId}
          lb={lb}
          clubTag={club.clubTag}
        />
      ))}
    </div>
  </div>
);

const LeaderboardBadge = ({
  lb,
  clubTag,
}: {
  lb: ClubApiLeaderboardEntry;
  clubTag: string;
}) => {
  const webId = apiIdToWebId(lb.leaderboardId);
  const lbName = leaderboards[webId as LeaderboardId]?.name ?? lb.leaderboardId;

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
      <span className="font-semibold">#{lb.clubRank.toLocaleString("en")}</span>
    </Link>
  );
};
