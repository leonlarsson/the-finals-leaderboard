import { BaseUser } from "@/types";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import getPlatformName from "@/utils/getPlatformName";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo } from "react";

type TopMoversPanelProps = {
  leaderboardVersion: LeaderboardId;
  platform: string;
  users: BaseUser[];
};

const TOP_N = 20;

export const TopMoversPanel = ({
  leaderboardVersion,
  platform,
  users,
}: TopMoversPanelProps) => {
  const leaderboard = leaderboards[leaderboardVersion];
  const platformName = getPlatformName(platform);

  const { gainers, decliners } = useMemo(() => {
    const movers = users.filter((u) => u.change !== 0);
    const gainers = [...movers]
      .sort((a, b) => b.change - a.change)
      .slice(0, TOP_N);
    const decliners = [...movers]
      .sort((a, b) => a.change - b.change)
      .slice(0, TOP_N);
    return { gainers, decliners };
  }, [users]);

  const noMovers = gainers.length === 0 && decliners.length === 0;

  return (
    <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
      <h2 className="mb-1 text-xl font-medium">
        Top Movers{" "}
        <span>
          ({leaderboard.name}
          {leaderboard.features.includes("platformSelection") && (
            <span> - {platformName}</span>
          )}
          )
        </span>
      </h2>
      <p className="mb-4 text-neutral-500">
        Biggest rank changes since the last leaderboard update.
      </p>

      {noMovers ? (
        <p className="text-neutral-500">
          No rank changes recorded yet for this leaderboard.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
          <MoversList title="Top Gainers" movers={gainers} type="gainer" />
          <MoversList title="Top Declines" movers={decliners} type="decliner" />
        </div>
      )}
    </div>
  );
};

const MoversList = ({
  title,
  movers,
  type,
}: {
  title: string;
  movers: BaseUser[];
  type: "gainer" | "decliner";
}) => (
  <div>
    <div className="mb-2 flex items-center gap-2 font-semibold">
      {type === "gainer" ? (
        <ChevronUp className="size-4 text-indigo-400" />
      ) : (
        <ChevronDown className="size-4 text-red-500" />
      )}
      {title}
    </div>
    <div className="flex flex-col gap-1">
      {movers.map((user) => (
        <div
          key={user.name}
          className="flex items-center justify-between gap-2 rounded px-2 py-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="w-12 shrink-0 tabular-nums text-neutral-500">
              #{user.rank.toLocaleString("en")}
            </span>
            <Link
              to="/players/$playerName"
              params={{ playerName: user.name }}
              className="truncate font-medium hover:underline"
            >
              {user.name.split("#")[0]}
              <span className="text-neutral-400">
                #{user.name.split("#")[1]}
              </span>
            </Link>
          </div>
          {type === "gainer" ? (
            <span className="inline-flex shrink-0 items-center text-indigo-400 dark:text-indigo-300">
              <ChevronUp className="size-3.5" />
              {user.change.toLocaleString("en")}
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center text-red-500">
              <ChevronDown className="size-3.5" />
              {Math.abs(user.change).toLocaleString("en")}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);
