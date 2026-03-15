import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { AppBarChart } from "@/components/AppBarChart";
import { BaseUser } from "@/types";
import leagues from "@/utils/leagues";
import getPlatformName from "@/utils/getPlatformName";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import Loading from "../Loading";
import LeagueImage from "../LeagueImage";
import { SponsorImage } from "../SponsorImage";
import { Separator } from "../ui/separator";
import { useMemo } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type LeagueThreshold = {
  league: string;
  topRank: number;
  minScore: number;
};

const allSponsors = {
  OSPUZE: {
    name: "OSPUZE",
    color: "#f8bc2c",
  },
  ENGIMO: {
    name: "ENGIMO",
    color: "#d31f3c",
  },
  "ALFA ACTA": {
    name: "ALFA ACTA",
    color: "#e01d45",
  },
  DISSUN: {
    name: "DISSUN",
    color: "#d21f3c",
  },
  VAIIYA: {
    name: "VAIIYA",
    color: "#cf2046",
  },
  "ISEUL-T": {
    name: "ISEUL-T",
    color: "#0094df",
  },
  HOLTOW: {
    name: "HOLTOW",
    color: "#f36b00",
  },
  CNS: {
    name: "CNS",
    color: "#ff56ff",
  },
  TRENTILA: {
    name: "TRENTILA",
    color: "#66d668",
  },
  VOLPE: {
    name: "VOLPE",
    color: "#d41d3f",
  },
};

const leaderboardToSponsors = {
  season9Sponsor: [
    allSponsors.OSPUZE,
    allSponsors.ENGIMO,
    allSponsors["ALFA ACTA"],
    allSponsors.DISSUN,
    allSponsors.VAIIYA,
    allSponsors["ISEUL-T"],
    allSponsors.HOLTOW,
    allSponsors.TRENTILA,
    allSponsors.VOLPE,
  ],
  season8Sponsor: [allSponsors.HOLTOW, allSponsors.TRENTILA],
  season7Sponsor: [allSponsors.VAIIYA, allSponsors.CNS],
  season6Sponsor: [
    allSponsors.OSPUZE,
    allSponsors.ENGIMO,
    allSponsors["ALFA ACTA"],
  ],
  season5Sponsor: [
    allSponsors.DISSUN,
    allSponsors.VAIIYA,
    allSponsors["ISEUL-T"],
  ],
  season4Sponsor: [
    allSponsors["ISEUL-T"],
    allSponsors.HOLTOW,
    allSponsors.ENGIMO,
  ],
} satisfies Partial<Record<LeaderboardId, { name: string; color: string }[]>>;

type LeaderboardStatsPanelProps = {
  leaderboardVersion: LeaderboardId;
  platform: string;
  users: BaseUser[];
};

export const LeaderboardStatsPanel = ({
  leaderboardVersion,
  platform,
  users,
}: LeaderboardStatsPanelProps) => {
  const leaderboard = leaderboards[leaderboardVersion];
  const platformName = getPlatformName(platform);
  const isSponsored = leaderboard.id in leaderboardToSponsors;
  const leaderboardSponsors = isSponsored
    ? leaderboardToSponsors[
        leaderboard.id as keyof typeof leaderboardToSponsors
      ]
    : [];

  // All hooks called unconditionally at top level
  const sortedSponsorsByAvgFans = useMemo(() => {
    return [...leaderboardSponsors].sort((a, b) => {
      const aUsers = users.filter((user) => user.sponsor === a.name);
      const bUsers = users.filter((user) => user.sponsor === b.name);
      const aAvg = aUsers.reduce((sum, u) => sum + u.fans!, 0) / aUsers.length;
      const bAvg = bUsers.reduce((sum, u) => sum + u.fans!, 0) / bUsers.length;
      return bAvg - aAvg;
    });
  }, [leaderboardSponsors, users]);

  const sortedSponsorsByPlayerCount = useMemo(() => {
    return [...leaderboardSponsors].sort((a, b) => {
      const aCount = users.filter((user) => user.sponsor === a.name).length;
      const bCount = users.filter((user) => user.sponsor === b.name).length;
      return bCount - aCount;
    });
  }, [leaderboardSponsors, users]);

  const sortedSponsorsByTotalFans = useMemo(() => {
    return [...leaderboardSponsors].sort((a, b) => {
      const aTotal = users
        .filter((user) => user.sponsor === a.name)
        .reduce((sum, u) => sum + u.fans!, 0);
      const bTotal = users
        .filter((user) => user.sponsor === b.name)
        .reduce((sum, u) => sum + u.fans!, 0);
      return bTotal - aTotal;
    });
  }, [leaderboardSponsors, users]);

  const leagueThresholds = useMemo<LeagueThreshold[]>(() => {
    if (!(leaderboardVersion in leagues) || users.length === 0) return [];
    const leagueList =
      leagues[leaderboardVersion as keyof typeof leagues] ?? [];
    return leagueList
      .map((league) => {
        const playersInLeague = users.filter((u) => u.league === league);
        if (playersInLeague.length === 0) return null;
        const topPlayer = playersInLeague[0];
        const minScore = topPlayer.fame ?? topPlayer.rankScore ?? 0;
        return { league, topRank: topPlayer.rank, minScore };
      })
      .filter((t): t is LeagueThreshold => t !== null);
  }, [leaderboardVersion, users]);

  const { gainers, decliners } = useMemo(() => {
    const movers = users.filter((u) => u.change !== 0);
    const gainers = [...movers]
      .sort((a, b) => b.change - a.change)
      .slice(0, 20);
    const decliners = [...movers]
      .sort((a, b) => a.change - b.change)
      .slice(0, 20);
    return { gainers, decliners };
  }, [users]);

  const scoreLabel =
    users.length > 0 && "rankScore" in users[0] ? "Rank Score" : "Fame";

  if (isSponsored) {
    return (
      <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
        <h2 className="mb-1 text-xl font-medium">
          Stats and Sponsor Distribution{" "}
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
            <div className="flex flex-col gap-2">
              {/* AVERAGES */}
              <span className="text-lg font-medium">Averages</span>

              <span>
                Average fans:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map((user) => user.fans!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </span>

              <>
                {sortedSponsorsByAvgFans.map((sponsor) => (
                  <span key={sponsor.name}>
                    Average {sponsor.name} fans:{" "}
                    <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                      {(
                        users
                          .filter((user) => user.sponsor === sponsor.name)
                          .map((user) => user.fans!)
                          .reduce((a, b) => a + b, 0) /
                        users.filter((user) => user.sponsor === sponsor.name)
                          .length
                      ).toLocaleString("en", { maximumFractionDigits: 0 })}
                    </span>
                  </span>
                ))}
              </>
            </div>

            <Separator className="my-3" />

            <div className="mb-3 text-lg font-medium">
              Out of the top {users.length.toLocaleString("en")}{" "}
              {leaderboard.name}
              {leaderboard.features.includes("platformSelection") && (
                <span> {platformName}</span>
              )}{" "}
              players...
            </div>

            <div className="my-4 flex flex-wrap justify-center gap-x-5 gap-y-1 px-2">
              {sortedSponsorsByPlayerCount.map((sponsor) => (
                <div key={sponsor.name} className="flex items-center gap-1">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: sponsor.color }}
                  />
                  <span>{sponsor.name}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center max-[850px]:grid-cols-1">
              <div className="flex flex-col items-center">
                <div className="text-lg font-medium">Players by sponsor</div>

                <div className="space-y-3">
                  <div className="flex flex-col items-center">
                    <ChartContainer
                      config={
                        Object.fromEntries(
                          sortedSponsorsByPlayerCount.map((s) => [
                            s.name,
                            { label: s.name, color: s.color },
                          ]),
                        ) satisfies ChartConfig
                      }
                      className="aspect-square max-h-[250px] w-full"
                    >
                      <PieChart>
                        <Pie
                          data={sortedSponsorsByPlayerCount.map((sponsor) => ({
                            name: sponsor.name,
                            value: users.filter(
                              (user) => user.sponsor === sponsor.name,
                            ).length,
                          }))}
                          dataKey="value"
                          nameKey="name"
                          isAnimationActive
                          animationDuration={500}
                          label={({ name }) => name}
                          // labelLine={false}
                        >
                          {sortedSponsorsByPlayerCount.map((sponsor, index) => (
                            <Cell key={index} fill={sponsor.color} />
                          ))}
                        </Pie>

                        <ChartTooltip
                          content={({ payload }) => {
                            const item = payload?.[0];
                            if (!item) return null;
                            return (
                              <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-left text-sm dark:bg-black">
                                <div className="inline-flex items-center gap-2">
                                  <SponsorImage
                                    sponsor={item.name as string}
                                    useIcon
                                    size={20}
                                  />
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                <span>
                                  {(item.value as number).toLocaleString("en")}{" "}
                                  players
                                </span>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className="space-y-1">
                    {sortedSponsorsByPlayerCount.map((sponsor) => (
                      <div key={sponsor.name}>
                        <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                          {users
                            .filter((user) => user.sponsor === sponsor.name)
                            .length.toLocaleString("en")}{" "}
                          (
                          {(
                            users.filter(
                              (user) => user.sponsor === sponsor.name,
                            ).length / users.length
                          ).toLocaleString("en", {
                            style: "percent",
                            maximumFractionDigits: 1,
                          })}
                          )
                        </span>{" "}
                        players have signed with{" "}
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">{sponsor.name}</span>
                          <SponsorImage
                            sponsor={sponsor.name}
                            useIcon
                            size={25}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-lg font-medium">Fans by sponsor</div>
                <div className="space-y-3">
                  <div className="flex flex-col items-center">
                    <ChartContainer
                      config={
                        Object.fromEntries(
                          sortedSponsorsByTotalFans.map((s) => [
                            s.name,
                            { label: s.name, color: s.color },
                          ]),
                        ) satisfies ChartConfig
                      }
                      className="aspect-square max-h-[250px] w-full"
                    >
                      <PieChart>
                        <Pie
                          data={sortedSponsorsByTotalFans.map((sponsor) => ({
                            name: sponsor.name,
                            value: users
                              .filter((user) => user.sponsor === sponsor.name)
                              .map((user) => user.fans!)
                              .reduce((a, b) => a + b, 0),
                          }))}
                          dataKey="value"
                          nameKey="name"
                          isAnimationActive
                          animationDuration={500}
                          label={({ name }) => name}
                          // labelLine={false}
                        >
                          {sortedSponsorsByTotalFans.map((sponsor, index) => (
                            <Cell key={index} fill={sponsor.color} />
                          ))}
                        </Pie>

                        <ChartTooltip
                          content={({ payload }) => {
                            const item = payload?.[0];
                            if (!item) return null;
                            return (
                              <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-left text-sm dark:bg-black">
                                <div className="inline-flex items-center gap-2">
                                  <SponsorImage
                                    sponsor={item.name as string}
                                    useIcon
                                    size={20}
                                  />
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                </div>
                                <span>
                                  {(item.value as number).toLocaleString("en")}{" "}
                                  total fans
                                </span>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className="space-y-1">
                    {sortedSponsorsByTotalFans.map((sponsor) => (
                      <div key={sponsor.name}>
                        <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                          {users
                            .filter((user) => user.sponsor === sponsor.name)
                            .map((user) => user.fans!)
                            .reduce((a, b) => a + b, 0)
                            .toLocaleString("en")}
                        </span>{" "}
                        fans of players signed with{" "}
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">{sponsor.name}</span>
                          <SponsorImage
                            sponsor={sponsor.name}
                            useIcon
                            size={25}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md bg-neutral-100 p-4 text-sm dark:bg-neutral-900/50">
      <h2 className="mb-1 text-xl font-medium">
        Stats and Rank Distribution{" "}
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
        <>
          <div className="flex flex-col gap-2">
            {/* AVERAGES */}
            <span className="text-lg font-medium">Averages</span>

            {leaderboardVersion === leaderboards.closedBeta1.id && (
              <span>
                Average XP:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map((user) => user.xp!).reduce((a, b) => a + b, 0) /
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
                    users
                      .map((user) => user.level!)
                      .reduce((a, b) => a + b, 0) / users.length
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
                      .map((user) => user.cashouts ?? 0)
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
                      .map((user) => user.fame ?? user.rankScore ?? 0)
                      .reduce((a, b) => a + b, 0) / users.length
                  ).toLocaleString("en", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}
          </div>

          <Separator className="my-3" />

          <span className="text-lg font-medium">
            Out of the top {users.length.toLocaleString("en")}{" "}
            {leaderboard.name}
            {leaderboard.features.includes("platformSelection") && (
              <span> {platformName}</span>
            )}{" "}
            players...
          </span>

          {/* LEAGUES BAR CHART */}
          <AppBarChart
            data={leagues[leaderboardVersion].map((league) => ({
              Players: users.filter((user) => league === user.league).length,
              name: league,
            }))}
            dataKey="Players"
            yAxisFormatter={(v) => v.toLocaleString("en")}
            tooltip={({ label, payload }) => {
              const amount = payload?.[0]?.value as number | undefined;
              return (
                <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                  <span>
                    {leaderboard.name}{" "}
                    {leaderboard.features.includes("platformSelection") && (
                      <span> - {platformName}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    {leagues[leaderboardVersion].includes(label as string) && (
                      <LeagueImage league={label as string} size={30} />
                    )}
                    <span className="font-medium">{label}</span>
                  </div>
                  <Separator />
                  {typeof amount === "number" && (
                    <span>
                      {amount.toLocaleString("en")} players (
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

          {/* LEAGUE THRESHOLDS */}
          {leagueThresholds.length > 0 && leaderboardVersion !== "season2" && (
            <>
              <Separator className="my-3" />
              <div className="mb-1 text-lg font-medium">League Thresholds</div>
              <p className="mb-3 text-neutral-500">
                The rank and minimum {scoreLabel.toLowerCase()} required to
                reach each league in the top {users.length.toLocaleString("en")}
                .
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <th className="pb-2 pr-4 font-semibold text-neutral-500">
                        League
                      </th>
                      <th className="pb-2 pr-4 font-semibold text-neutral-500">
                        Top Rank
                      </th>
                      <th className="pb-2 font-semibold text-neutral-500">
                        Min {scoreLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...leagueThresholds]
                      .reverse()
                      .map(({ league, topRank, minScore }) => (
                        <tr
                          key={league}
                          className="border-b border-neutral-200 last:border-0 dark:border-neutral-700"
                        >
                          <td className="py-1.5 pr-4">
                            <div className="flex items-center gap-2">
                              <LeagueImage league={league} size={24} />
                              <span>{league}</span>
                            </div>
                          </td>
                          <td className="py-1.5 pr-4 tabular-nums">
                            #{topRank.toLocaleString("en")}
                          </td>
                          <td className="py-1.5 tabular-nums">
                            {minScore.toLocaleString("en")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* TOP MOVERS */}
          {leaderboard.features.includes("statsPanelMovers") &&
            (() => {
              const noMovers = gainers.length === 0 && decliners.length === 0;
              return (
                <>
                  <Separator className="my-3" />
                  <div className="mb-1 text-lg font-medium">Top Movers</div>
                  <p className="mb-3 text-neutral-500">
                    The biggest rank changes in the last 24 hours.
                  </p>

                  {noMovers ? (
                    <p className="text-neutral-500">
                      No rank changes recorded yet for this leaderboard.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
                      <MoversList
                        title="Top Gainers"
                        movers={gainers}
                        type="gainer"
                      />
                      <MoversList
                        title="Top Declines"
                        movers={decliners}
                        type="decliner"
                      />
                    </div>
                  )}
                </>
              );
            })()}
        </>
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
        <ChevronUpIcon className="size-4 text-indigo-400" />
      ) : (
        <ChevronDownIcon className="size-4 text-red-500" />
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
              <ChevronUpIcon className="size-3.5" />
              {user.change.toLocaleString("en")}
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center text-red-500">
              <ChevronDownIcon className="size-3.5" />
              {Math.abs(user.change).toLocaleString("en")}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);
