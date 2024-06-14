import { BarChart } from "@tremor/react";
import { Platforms, BaseUser } from "@/types";
import { LoaderIcon } from "lucide-react";
import leagues from "@/utils/leagues";
import getPlatformName from "@/utils/getPlatformName";
import leagueIsLiveFunc from "@/utils/leagueIsLive";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import leagueToImage from "@/utils/leagueToImage";

type Props = {
  leaderboardVersion: LeaderboardId;
  platform: Platforms;
  users: BaseUser[];
};

export default ({ leaderboardVersion, platform, users }: Props) => {
  const leaderboardName = leaderboards[leaderboardVersion].name;
  const platformName = getPlatformName(platform);
  const leagueIsLive = leagueIsLiveFunc(leaderboardVersion);

  return (
    <div className="rounded-md bg-neutral-100 p-2 text-sm dark:bg-neutral-900/50">
      <h2 className="mb-1 text-xl font-medium">
        Stats and Rank Distribution{" "}
        <span>
          ({leaderboardName}
          {leagueIsLive && <span> - {platformName}</span>})
        </span>
      </h2>
      {users.length === 0 && (
        <LoaderIcon className="inline size-5 animate-spin" />
      )}

      {users.length !== 0 && (
        <>
          <div className="flex flex-col gap-2">
            {/* AVERAGES */}
            <span className="text-lg font-medium">Averages</span>

            {leaderboardVersion === leaderboards.closedBeta1.id && (
              <span>
                Average XP:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map(user => user.xp!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}

            {leaderboardVersion === leaderboards.closedBeta1.id && (
              <span>
                Average Level:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map(user => user.level!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}

            {"cashouts" in users[0] && (
              <span>
                Average Cashouts:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users
                      .map(user => user.cashouts ?? 0)
                      .reduce((a, b) => a + b, 0) / users.length
                  ).toLocaleString("en", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </span>
            )}

            {leaderboardVersion !== "season2" && (
              <span>
                Average {"rankScore" in users[0] ? "Rank Score" : "Fame"}:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users
                      .map(user => user.fame ?? user.rankScore ?? 0)
                      .reduce((a, b) => a + b, 0) / users.length
                  ).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}
          </div>

          <hr className="my-2 border-black/30 dark:border-white/30" />

          <span className="text-lg font-medium">
            Out of the top {users.length.toLocaleString("en")} {leaderboardName}
            {leagueIsLive && <span> {platformName}</span>} players...
          </span>

          {/* LEAGUES BAR CHART */}
          <BarChart
            className="my-2"
            data={leagues[leaderboardVersion].map(league => ({
              Players: users.filter(user => league === user.league).length,
              name: league,
            }))}
            index="name"
            categories={["Players"]}
            colors={["#d31f3c"]}
            valueFormatter={v => v.toLocaleString("en")}
            showAnimation
            customTooltip={({ label, payload }) => {
              const amount = payload?.[0]?.value;
              return (
                <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                  <span>
                    {leaderboardName}{" "}
                    {leagueIsLive && <span> - {platformName}</span>}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{label}</span>
                    {leagues[leaderboardVersion].includes(label as string) &&
                      leagueToImage(label as string, 30)}
                  </div>

                  <hr />
                  {typeof amount === "number" && (
                    <span>
                      {amount.toLocaleString("en") ?? 0} players (
                      {(amount / users.length).toLocaleString("en", {
                        style: "percent",
                        maximumFractionDigits: 1,
                      })}
                      )
                    </span>
                  )}
                </div>
              );
            }}
          />
        </>
      )}
    </div>
  );
};
