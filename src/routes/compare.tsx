import { panels } from "@/types";
import type { BaseUserWithExtras } from "@/types";
import LeagueImage from "@/components/LeagueImage";
import { SponsorImage } from "@/components/SponsorImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Leaderboard, LeaderboardId, leaderboards } from "@/utils/leaderboards";
import { useQueries } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ChevronDown,
  ChevronUp,
  Minus,
  UserRoundIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  players: z.string().array().optional(),
});

export const Route = createFileRoute("/compare")({
  validateSearch: (search) => searchSchema.parse(search),
  component: RouteComponent,
});

const allLeaderboards = Object.values(leaderboards).filter(
  (lb) => lb.enabled,
) as Leaderboard[];

const getSeasonGroup = (id: string): string => {
  if (id.startsWith("season9")) return "Season 9";
  if (id.startsWith("season8")) return "Season 8";
  if (id.startsWith("season7")) return "Season 7";
  if (id.startsWith("season6")) return "Season 6";
  if (id.startsWith("season5")) return "Season 5";
  if (id.startsWith("season4")) return "Season 4";
  if (id.startsWith("season3")) return "Season 3";
  if (id.startsWith("season2")) return "Season 2";
  if (id.startsWith("season1")) return "Season 1";
  if (id.startsWith("openBeta")) return "Open Beta";
  if (id.startsWith("closedBeta")) return "Closed Beta";
  return "Other";
};

const seasonOrder = [
  "Season 9",
  "Season 8",
  "Season 7",
  "Season 6",
  "Season 5",
  "Season 4",
  "Season 3",
  "Season 2",
  "Season 1",
  "Open Beta",
  "Closed Beta",
  "Other",
];

function RouteComponent() {
  const { players = [] } = Route.useSearch();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<[string, string]>([
    players[0] ?? "",
    players[1] ?? "",
  ]);

  const player1 = players[0];
  const player2 = players[1];

  useEffect(() => {
    const title =
      player1 && player2
        ? `${player1} vs ${player2} · Enhanced Leaderboard – THE FINALS`
        : "Compare Players · Enhanced Leaderboard – THE FINALS";
    document.title = title;
    return () => {
      document.title = "Enhanced Leaderboard – THE FINALS";
    };
  }, [player1, player2]);

  const queries = useQueries({
    queries: allLeaderboards.map((lb) => ({
      queryKey: ["leaderboard", lb.id],
      queryFn: () => lb.fetchData("crossplay") as Promise<BaseUserWithExtras[]>,
      staleTime: Infinity,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const handleCompare = () => {
    const cleaned = inputs.map((s) => s.replace(/\s*#\s*/g, "#").trim()).filter(Boolean);
    navigate({
      to: "/compare",
      search: { players: cleaned.length ? cleaned : undefined },
    });
  };

  const getUser = (playerName: string, lbIndex: number) =>
    (queries[lbIndex].data as BaseUserWithExtras[] | undefined)?.find(
      (u) => u.name.toLowerCase() === playerName.toLowerCase(),
    );

  // Leaderboards where at least one player appears
  const relevantLbs = player1
    ? allLeaderboards.filter((_lb, i) => {
        const u1 = getUser(player1, i);
        const u2 = player2 ? getUser(player2, i) : undefined;
        return u1 !== undefined || u2 !== undefined;
      })
    : [];

  // Group by season
  const grouped = new Map<string, typeof relevantLbs>();
  for (const lb of relevantLbs) {
    const group = getSeasonGroup(lb.id);
    if (!grouped.has(group)) grouped.set(group, []);
    grouped.get(group)!.push(lb);
  }
  const sortedGroups = [...grouped.entries()].sort(
    ([a], [b]) => seasonOrder.indexOf(a) - seasonOrder.indexOf(b),
  );

  return (
    <div className="my-4 flex flex-col gap-6">
      <Link
        to="/"
        className="flex w-fit items-center gap-1 font-medium hover:underline"
      >
        <ArrowLeftIcon size={20} /> Back to leaderboards
      </Link>

      <div>
        <div className="mb-4 text-2xl font-medium">Compare Players</div>

        {/* Input row */}
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Player 1
            </label>
            <Input
              className="w-52"
              placeholder="Name#1234"
              value={inputs[0]}
              onChange={(e) => setInputs([e.target.value, inputs[1]])}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
            />
          </div>
          <span className="pb-[9px] text-sm font-medium text-neutral-400">
            vs
          </span>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">
              Player 2
            </label>
            <Input
              className="w-52"
              placeholder="Name#1234"
              value={inputs[1]}
              onChange={(e) => setInputs([inputs[0], e.target.value])}
              onKeyDown={(e) => e.key === "Enter" && handleCompare()}
            />
          </div>
          <Button onClick={handleCompare}>Compare</Button>
        </div>
      </div>

      {/* Results */}
      {player1 && player2 && (
        <div className="flex flex-col gap-6">
          {/* Player name headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr] items-center gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-800">
            <PlayerNameChip name={player1} />
            <span className="text-center text-xs font-medium uppercase tracking-wider text-neutral-400">
              Leaderboard
            </span>
            <div className="flex justify-end">
              <PlayerNameChip name={player2} />
            </div>
          </div>

          {isLoading && (
            <p className="text-sm text-neutral-500">Loading data...</p>
          )}

          {!isLoading && sortedGroups.length === 0 && (
            <p className="text-neutral-500">
              Neither player was found in the top 10K of any leaderboard.
            </p>
          )}

          {sortedGroups.map(([season, lbs]) => (
            <div key={season}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                {season}
              </div>
              <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-sm">
                  <tbody>
                    {lbs.map((lb, lbLocalIdx) => {
                      const globalIdx = allLeaderboards.findIndex(
                        (x) => x.id === lb.id,
                      );
                      const u1 = getUser(player1, globalIdx);
                      const u2 = getUser(player2, globalIdx);
                      return (
                        <ComparisonRow
                          key={lb.id}
                          lb={lb}
                          u1={u1}
                          u2={u2}
                          isLast={lbLocalIdx === lbs.length - 1}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single player: show hint */}
      {player1 && !player2 && !isLoading && (
        <p className="text-sm text-neutral-500">
          Enter a second player name above and click Compare.
        </p>
      )}
    </div>
  );
}

function PlayerNameChip({ name }: { name: string }) {
  const [base, tag] = name.split("#");
  return (
    <Link
      to="/players/$playerName"
      params={{ playerName: name }}
      className="flex w-fit items-center gap-1.5 font-medium hover:underline"
    >
      <UserRoundIcon className="size-4 shrink-0 text-neutral-400" />
      <span>{base}</span>
      {tag && <span className="text-neutral-400">#{tag}</span>}
    </Link>
  );
}

function ComparisonRow({
  lb,
  u1,
  u2,
  isLast,
}: {
  lb: Leaderboard;
  u1: BaseUserWithExtras | undefined;
  u2: BaseUserWithExtras | undefined;
  isLast: boolean;
}) {
  return (
    <tr
      className={`grid grid-cols-[1fr_auto_1fr] items-center ${!isLast ? "border-b border-neutral-200 dark:border-neutral-800" : ""}`}
    >
      <td className="px-4 py-3">
        <PlayerStat user={u1} lb={lb} />
      </td>
      <td className="px-4 py-3 text-center">
        <Link
          to="/"
          search={{ lb: lb.id as LeaderboardId, panel: panels.LEADERBOARD }}
          className="text-xs font-medium text-neutral-500 hover:underline"
        >
          {lb.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-right">
        <PlayerStat user={u2} lb={lb} align="right" />
      </td>
    </tr>
  );
}

function PlayerStat({
  user,
  lb,
  align = "left",
}: {
  user: BaseUserWithExtras | undefined;
  lb: Leaderboard;
  align?: "left" | "right";
}) {
  const cols = lb.tableColumns;
  const side = align === "right" ? "items-end" : "items-start";

  if (!user)
    return (
      <div className={`flex flex-col ${side}`}>
        <span className="text-sm text-neutral-400">—</span>
      </div>
    );

  return (
    <div className={`flex flex-col gap-0.5 ${side}`}>
      <span className="font-semibold">#{user.rank.toLocaleString("en")}</span>

      {cols.includes("change") && <RankChange change={user.change} />}

      {cols.includes("fame") && user.league && (
        <div className="flex items-center gap-1">
          <LeagueImage league={user.league} size={14} />
          <span className="text-xs text-neutral-500">{user.league}</span>
        </div>
      )}

      {cols.includes("fame") &&
        (user.fame !== undefined || user.rankScore !== undefined) && (
          <span className="text-xs text-neutral-500">
            {(user.fame ?? user.rankScore ?? 0).toLocaleString("en")}{" "}
            {user.rankScore !== undefined ? "RS" : "fame"}
          </span>
        )}

      {cols.includes("fans") && user.sponsor && (
        <div className="flex items-center gap-1">
          <SponsorImage sponsor={user.sponsor} size={14} useIcon />
          <span className="text-xs text-neutral-500">
            {(user.fans ?? 0).toLocaleString("en")} fans
          </span>
        </div>
      )}

      {!cols.includes("fame") &&
        cols.includes("cashouts") &&
        user.cashouts !== undefined && (
          <span className="text-xs text-neutral-500">
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
          <span className="text-xs text-neutral-500">
            {user.points.toLocaleString("en")} pts
          </span>
        )}
    </div>
  );
}

function RankChange({ change }: { change: number }) {
  if (change > 0)
    return (
      <span className="inline-flex items-center text-xs text-indigo-400 dark:text-indigo-300">
        <ChevronUp className="size-3" />
        {change.toLocaleString("en")}
      </span>
    );
  if (change < 0)
    return (
      <span className="inline-flex items-center text-xs text-red-500">
        <ChevronDown className="size-3" />
        {Math.abs(change).toLocaleString("en")}
      </span>
    );
  return (
    <span className="inline-flex items-center text-xs text-neutral-500">
      <Minus className="size-3" />0
    </span>
  );
}
