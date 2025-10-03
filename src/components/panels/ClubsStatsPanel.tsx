import { BarChart } from "@tremor/react";
import { BaseUser } from "@/types";
import getPlatformName from "@/utils/getPlatformName";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import Loading from "../Loading";
import { useMemo, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { ClubsDataTable } from "../tables/ClubsDataTable";
import { clubsDataTableColumns } from "../tables/ClubsDataTableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { Separator } from "../ui/separator";

type ClubsStatsPanelProps = {
  leaderboardVersion: LeaderboardId;
  platform: string;
  users: BaseUser[];
  isLoading: boolean;
  isRefetching: boolean;
};

export const ClubsStatsPanel = ({
  leaderboardVersion,
  platform,
  users,
  isLoading,
  isRefetching,
}: ClubsStatsPanelProps) => {
  const [topXToDisplay, setTopXToDisplay] = useState(30);
  const leaderboard = leaderboards[leaderboardVersion];
  const platformName = getPlatformName(platform);

  const getLeaderboardMetadata = (leaderboardVersion: LeaderboardId) => {
    const metadataMap = {
      [leaderboards.season8.id]: {
        barChartLabel: "Rank Score",
      },
      [leaderboards.season8Sponsor.id]: {
        barChartLabel: "Fans",
      },
      [leaderboards.season8WorldTour.id]: {
        barChartLabel: "Cashouts",
      },
      [leaderboards.season8Head2Head.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season8PowerShift.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season8QuickCash.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season8TeamDeathmatch.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season8HeavenOrElse.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7.id]: {
        barChartLabel: "Rank Score",
      },
      [leaderboards.season7Sponsor.id]: {
        barChartLabel: "Fans",
      },
      [leaderboards.season7WorldTour.id]: {
        barChartLabel: "Cashouts",
      },
      [leaderboards.season7TerminalAttack.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7PowerShift.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7QuickCash.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7TeamDeathmatch.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7BlastOff.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season7CashBall.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season6.id]: {
        barChartLabel: "Rank Score",
      },
      [leaderboards.season6Sponsor.id]: {
        barChartLabel: "Fans",
      },
      [leaderboards.season6WorldTour.id]: {
        barChartLabel: "Cashouts",
      },
      [leaderboards.season6TerminalAttack.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season6PowerShift.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season6QuickCash.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season6TeamDeathmatch.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season6HeavyHitters.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season5.id]: {
        barChartLabel: "Rank Score",
      },
      [leaderboards.season5Sponsor.id]: {
        barChartLabel: "Fans",
      },
      [leaderboards.season5WorldTour.id]: {
        barChartLabel: "Cashouts",
      },
      [leaderboards.season5TerminalAttack.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season5PowerShift.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season5QuickCash.id]: {
        barChartLabel: "Points",
      },
      [leaderboards.season5BankIt.id]: {
        barChartLabel: "Points",
      },
    };

    return (
      metadataMap[leaderboardVersion] || {
        barChartLabel: "Unknown",
      }
    );
  };

  const leaderboardMetadata = getLeaderboardMetadata(leaderboardVersion);

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

  const tableData = useMemo(() => {
    const memberCounts: { [key: string]: number } = {};
    for (const user of users) {
      if (user.clubTag) {
        memberCounts[user.clubTag] = (memberCounts[user.clubTag] || 0) + 1;
      }
    }

    return topClubsByRankScoreOrPointsOrFansOrCashouts.map(
      ([clubTag, int], index) => ({
        rank: index + 1,
        clubTag,
        members: memberCounts[clubTag] || 0,
        totalValue: int ?? 0,
      }),
    );
  }, [topClubsByRankScoreOrPointsOrFansOrCashouts, users, leaderboardMetadata]);

  const averageClubRankScoreOrPointsOrFansOrCashouts =
    topClubsByRankScoreOrPointsOrFansOrCashouts.reduce(
      (acc, [, amount]) =>
        acc + amount / topClubsByRankScoreOrPointsOrFansOrCashouts.length,
      0,
    );

  return (
    <>
      <ClubsDataTable
        queryState={{ isLoading, isRefetching }}
        columns={
          clubsDataTableColumns(leaderboardVersion) as ColumnDef<unknown>[]
        }
        data={tableData}
      />

      <Separator />

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
                Average club {leaderboardMetadata.barChartLabel.toLowerCase()}:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {averageClubRankScoreOrPointsOrFansOrCashouts.toLocaleString(
                    "en",
                    { maximumFractionDigits: 0 },
                  )}
                </span>
              </div>
            </div>

            <Separator className="my-3" />

            <div>
              <div>
                <span className="text-lg font-medium">
                  Top {topXToDisplay} clubs by{" "}
                  {leaderboardMetadata.barChartLabel}:
                </span>

                <br />

                <span>
                  Data limited to top {users.length.toLocaleString("en")}{" "}
                  players.
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topXToDisplay"
                  checked={topXToDisplay === 300}
                  onCheckedChange={(e) => setTopXToDisplay(e ? 300 : 30)}
                />
                <label htmlFor="topXToDisplay">Show top 300</label>
              </div>

              <BarChart
                className="my-2"
                data={topClubsByRankScoreOrPointsOrFansOrCashouts
                  .slice(0, topXToDisplay)
                  .toReversed()
                  .map(([clubTag, int]) => ({
                    name: clubTag,
                    [leaderboardMetadata.barChartLabel]: int,
                  }))}
                index="name"
                categories={[leaderboardMetadata.barChartLabel]}
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

                      <span>
                        {playersInClub.toLocaleString("en")} players in club
                      </span>

                      <Separator />

                      {typeof amount === "number" && (
                        <span>
                          {amount.toLocaleString("en") ?? 0}{" "}
                          {leaderboardMetadata.barChartLabel.toLowerCase()}
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
    </>
  );
};
