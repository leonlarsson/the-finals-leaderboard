import { Link } from "@tanstack/react-router";
import { StarIcon, UserRoundIcon } from "lucide-react";
import { panels } from "@/types";
import type { BaseUserWithExtras } from "@/types";
import { Leaderboard, LeaderboardId } from "@/utils/leaderboards";

export type PlayerAppearance = {
  lb: Leaderboard;
  user: BaseUserWithExtras;
};

export type PlayerResult = {
  name: string;
  clubTag: string | undefined;
  steamName: string;
  psnName: string;
  xboxName: string;
  appearances: PlayerAppearance[];
  bestRank: number;
};

export const PlayerResultCard = ({
  player,
  isFavorited,
  onToggleFavorite,
}: {
  player: PlayerResult;
  isFavorited?: boolean;
  onToggleFavorite?: () => void;
}) => {
  const hashIndex = player.name.lastIndexOf("#");
  const base = hashIndex !== -1 ? player.name.slice(0, hashIndex) : player.name;
  const tag = hashIndex !== -1 ? player.name.slice(hashIndex + 1) : null;

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/players/$playerName"
          params={{ playerName: player.name }}
          className="flex min-w-0 items-center gap-1.5 font-medium hover:underline"
        >
          <UserRoundIcon className="size-4 shrink-0 text-neutral-400" />
          <span className="truncate">
            {base}
            {tag && <span className="text-neutral-400">#{tag}</span>}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {player.clubTag && (
            <Link
              to="/clubs/$clubTag"
              params={{ clubTag: player.clubTag }}
              className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-medium transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              [{player.clubTag}]
            </Link>
          )}
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className={`transition-colors ${isFavorited ? "text-yellow-400" : "text-neutral-300 hover:text-yellow-400"}`}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <StarIcon
                className={`size-4 ${isFavorited ? "fill-yellow-400" : ""}`}
              />
            </button>
          )}
        </div>
      </div>

      {(player.steamName || player.psnName || player.xboxName) && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-neutral-500">
          {player.steamName && <span>Steam: {player.steamName}</span>}
          {player.xboxName && <span>Xbox: {player.xboxName}</span>}
          {player.psnName && <span>PSN: {player.psnName}</span>}
        </div>
      )}

      {player.appearances.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {player.appearances
            .toSorted((a, b) => a.user.rank - b.user.rank)
            .map(({ lb, user }) => (
              <AppearanceBadge key={lb.id} lb={lb} user={user} />
            ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">
          Not found in the top 10K of any leaderboard.
        </p>
      )}
    </div>
  );
};

const AppearanceBadge = ({
  lb,
  user,
}: {
  lb: Leaderboard;
  user: BaseUserWithExtras;
}) => (
  <Link
    to="/"
    search={{
      lb: lb.id as LeaderboardId,
      name: user.name,
      panel: panels.LEADERBOARD,
    }}
    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
  >
    <span className="text-neutral-500">{lb.name}</span>
    <span className="font-semibold">#{user.rank.toLocaleString("en")}</span>
  </Link>
);
