import { BarChart } from "@tremor/react";
import { Platforms, BaseUser } from "@/types";
import getPlatformName from "@/utils/getPlatformName";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import Loading from "./Loading";
import { useMemo, useState } from "react";
import { Checkbox } from "./ui/checkbox";

type Props = {
  leaderboardVersion: LeaderboardId;
  platform: Platforms;
  users: BaseUser[];
};

export const ClubStatsPanel = ({
  leaderboardVersion,
  platform,
  users,
}: Props) => {
  const [topXToDisplay, setTopXToDisplay] = useState(30);
  const leaderboard = leaderboards[leaderboardVersion];
  const platformName = getPlatformName(platform);

  const amountOfUniqueClubTags = new Set(users.map((user) => user.clubTag))
    .size;

  const amountOfPlayersWithoutClub = users.filter(
    (user) => !user.clubTag,
  ).length;

  const topClubsByRankScoreOrPointsOrFansOrCashouts = useMemo(() => {
    return Object.entries(
      users.reduce(
        (acc, user) => {
          if (!user.clubTag) return acc;
          if (!acc[user.clubTag]) acc[user.clubTag] = 0;
          acc[user.clubTag] +=
            user.rankScore ?? user.points ?? user.fans ?? user.cashouts ?? 0;
          return acc;
        },
        {} as { [clubTag: string]: number },
      ),
    ).sort((a, b) => b[1] - a[1]);
  }, [users]);

  const averageClubRankScoreOrPointsOrFansOrCashouts =
    topClubsByRankScoreOrPointsOrFansOrCashouts.reduce(
      (acc, [, amount]) =>
        acc + amount / topClubsByRankScoreOrPointsOrFansOrCashouts.length,
      0,
    );

  const barChartBasedOn = {
    [leaderboards.season5.id]: "Rank Score",
    [leaderboards.season5Sponsor.id]: "Fans",
    [leaderboards.season5WorldTour.id]: "Cashouts",
    [leaderboards.season5TerminalAttack.id]: "Points",
    [leaderboards.season5PowerShift.id]: "Points",
    [leaderboards.season5QuickCash.id]: "Points",
    [leaderboards.season5BankIt.id]: "Points",
  }[leaderboardVersion];

  return (
    <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
      <h2 className="mb-1 text-xl font-medium">
        Club Stats{" "}
        <span>
          ({leaderboard.name}
          {leaderboard.features.includes("platformSelection") && (
            <span> - {platformName}</span>
          )}
          )
        </span>
      </h2>
      {users.length === 0 && <Loading />}

      {users.length !== 0 && (
        <div>
          <div className="mb-3 text-lg font-medium">
            In the top {users.length.toLocaleString("en")} {leaderboard.name}
            {leaderboard.features.includes("platformSelection") && (
              <span> {platformName}</span>
            )}{" "}
            players...
          </div>

          <div className="flex flex-col gap-2">
            <div>
              There are{" "}
              <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                {amountOfUniqueClubTags.toLocaleString("en")}
              </span>{" "}
              unique clubs represented
            </div>
            <div>
              There are{" "}
              <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                {amountOfPlayersWithoutClub.toLocaleString("en")}
              </span>{" "}
              players without a club
            </div>

            <div>
              Average club {barChartBasedOn.toLowerCase()}:{" "}
              <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                {averageClubRankScoreOrPointsOrFansOrCashouts.toLocaleString(
                  "en",
                  { maximumFractionDigits: 0 },
                )}
              </span>
            </div>
          </div>

          <br />

          <div>
            <div>
              <span className="text-lg font-medium">
                Top {topXToDisplay} clubs by {barChartBasedOn}
              </span>
              <br />
              <span>
                Data limited to top {users.length.toLocaleString("en")} players.
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="topXToDisplay"
                checked={topXToDisplay === 300}
                onCheckedChange={(e) => setTopXToDisplay(e ? 300 : 30)}
              />
              <label htmlFor="topXToDisplay">Show top 300 (can be slow)</label>
            </div>

            <BarChart
              className="my-2"
              data={topClubsByRankScoreOrPointsOrFansOrCashouts
                .slice(0, topXToDisplay)
                .toReversed()
                .map(([clubTag, int]) => ({
                  name: clubTag,
                  [barChartBasedOn]: int,
                }))}
              index="name"
              categories={[barChartBasedOn]}
              colors={["#d31f3c"]}
              valueFormatter={(v) => v.toLocaleString("en")}
              showAnimation
              yAxisWidth={100}
              animationDuration={400}
              customTooltip={({ label, payload }) => {
                const clubTag = label;
                const clubPosition =
                  topClubsByRankScoreOrPointsOrFansOrCashouts.findIndex(
                    ([tag]) => tag === clubTag,
                  ) + 1;
                const amount = payload?.[0]?.value;
                const playersInClub = users.filter(
                  (user) => user.clubTag === clubTag,
                ).length;

                return (
                  <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                    <span>{leaderboard.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        #{clubPosition.toLocaleString("en")} | {clubTag}
                      </span>
                    </div>
                    {playersInClub.toLocaleString("en")} players in club
                    <hr />
                    {typeof amount === "number" && (
                      <span>
                        {amount.toLocaleString("en") ?? 0}{" "}
                        {barChartBasedOn.toLowerCase()}
                      </span>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
