import { panels } from "@/types";
import type { BaseUserWithExtras } from "@/types";
import LeagueImage from "@/components/LeagueImage";
import { SponsorImage } from "@/components/SponsorImage";
import { type Leaderboard, LeaderboardId } from "@/utils/leaderboards";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";

export const SkeletonCard = () => {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div className="h-4 w-10 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-6 w-14 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="h-4 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex items-center gap-2">
        <div className="size-8 rounded bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
};

export const SeasonSection = ({
  season,
  entries,
  playerName,
  currentSeasonName,
}: {
  season: string;
  entries: { lb: Leaderboard; user: BaseUserWithExtras }[];
  playerName: string;
  currentSeasonName: string;
}) => {
  return (
    <div>
      {season !== currentSeasonName && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {season}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entries.map(({ lb, user }) => (
          <StatCard key={lb.id} lb={lb} user={user} playerName={playerName} />
        ))}
      </div>
    </div>
  );
};

export const StatCard = ({
  lb,
  user,
  playerName,
}: {
  lb: Leaderboard;
  user: BaseUserWithExtras;
  playerName: string;
}) => {
  const cols = lb.tableColumns;

  return (
    <Link
      to="/"
      search={{
        lb: lb.id as LeaderboardId,
        name: playerName,
        panel: panels.LEADERBOARD,
      }}
      className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
    >
      {/* Leaderboard name + rank */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-neutral-500">{lb.name}</span>
        <span className="text-lg font-semibold">
          #{user.rank.toLocaleString("en")}
        </span>
      </div>

      {/* Rank change */}
      {cols.includes("change") && (
        <div>
          {user.change > 0 ? (
            <span className="inline-flex items-center text-sm text-indigo-400 animate-in slide-in-from-bottom-1 dark:text-indigo-300">
              <ChevronUp className="h-4" />
              {user.change.toLocaleString("en")}
            </span>
          ) : user.change < 0 ? (
            <span className="inline-flex items-center text-sm text-red-500 animate-in slide-in-from-top-1">
              <ChevronDown className="h-4" />
              {Math.abs(user.change).toLocaleString("en")}
            </span>
          ) : (
            <span className="inline-flex items-center text-sm text-neutral-500">
              <Minus className="h-4" />
              {user.change.toLocaleString("en")}
            </span>
          )}
        </div>
      )}

      {/* League badge */}
      {user.league && cols.includes("fame") && (
        <div className="flex items-center gap-2">
          <LeagueImage league={user.league} size={32} />
          <span className="text-sm">{user.league}</span>
        </div>
      )}

      {/* Key stat */}
      <div className="text-sm text-neutral-600 dark:text-neutral-400">
        {cols.includes("fans") && user.sponsor && (
          <div className="flex flex-col gap-1">
            <SponsorImage sponsor={user.sponsor} size={60} useIcon />
            <span>{(user.fans ?? 0).toLocaleString("en")} fans</span>
          </div>
        )}
        {cols.includes("fame") &&
          (user.fame !== undefined || user.rankScore !== undefined) && (
            <span>
              {(user.fame ?? user.rankScore ?? 0).toLocaleString("en")}{" "}
              {user.rankScore !== undefined ? "rank score" : "fame"}
            </span>
          )}
        {!cols.includes("fame") &&
          cols.includes("cashouts") &&
          user.cashouts !== undefined && (
            <span>
              {user.cashouts.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </span>
          )}
        {!cols.includes("fame") &&
          !cols.includes("cashouts") &&
          cols.includes("points") &&
          user.points !== undefined && (
            <span>{user.points.toLocaleString("en")} pts</span>
          )}
        {cols.includes("score") && user.score !== undefined && (
          <span>{user.score.toLocaleString("en")} score</span>
        )}
        {cols.includes("distance") && user.distance !== undefined && (
          <span>{user.distance.toFixed(2)} km</span>
        )}
      </div>
    </Link>
  );
};
