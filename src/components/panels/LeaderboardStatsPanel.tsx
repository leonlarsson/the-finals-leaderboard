import { BarChart, DonutChart, Legend } from "@tremor/react";
import { BaseUser } from "@/types";
import leagues from "@/utils/leagues";
import getPlatformName from "@/utils/getPlatformName";
import { LeaderboardId, leaderboards } from "@/utils/leaderboards";
import Loading from "../Loading";
import LeagueImage from "../LeagueImage";
import { SponsorImage } from "../SponsorImage";
import { Separator } from "../ui/separator";

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
};

const leaderboardToSponsors = {
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
};

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

  if (
    leaderboard.id === "season7Sponsor" ||
    leaderboard.id === "season6Sponsor" ||
    leaderboard.id === "season5Sponsor" ||
    leaderboard.id === "season4Sponsor"
  ) {
    const leaderboardSponsors = leaderboardToSponsors[leaderboard.id];
    const sponsorColorsArray = leaderboardSponsors.map(
      (sponsor) => sponsor.color,
    );

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
                {leaderboardSponsors.map((sponsor) => (
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

            <div className="grid grid-cols-2 gap-4 text-center max-[850px]:grid-cols-1">
              <div className="flex flex-col items-center">
                <div className="mb-1 text-lg font-medium">
                  Players by sponsor
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col items-center">
                    <DonutChart
                      className="my-2"
                      variant="pie"
                      showLabel
                      data={leaderboardSponsors.map((sponsor) => ({
                        name: sponsor.name,
                        value: users.filter(
                          (user) => user.sponsor === sponsor.name,
                        ).length,
                      }))}
                      colors={sponsorColorsArray}
                      valueFormatter={(v) =>
                        `${v.toLocaleString("en")} players`
                      }
                      showAnimation
                      animationDuration={500}
                    />
                    <Legend
                      categories={leaderboardSponsors.map(
                        (sponsor) => sponsor.name,
                      )}
                      colors={sponsorColorsArray}
                    />
                  </div>

                  <div className="space-y-1">
                    {leaderboardSponsors.map((sponsor) => (
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
                <div className="mb-1 text-lg font-medium">Fans by sponsor</div>
                <div className="space-y-3">
                  <div className="flex flex-col items-center">
                    <DonutChart
                      className="my-2"
                      variant="pie"
                      showLabel
                      data={leaderboardSponsors.map((sponsor) => ({
                        name: sponsor.name,
                        value: users
                          .filter((user) => user.sponsor === sponsor.name)
                          .map((user) => user.fans!)
                          .reduce((a, b) => a + b, 0),
                      }))}
                      colors={sponsorColorsArray}
                      valueFormatter={(v) =>
                        `${v.toLocaleString("en")} total fans`
                      }
                      showAnimation
                      animationDuration={500}
                    />
                    <Legend
                      categories={leaderboardSponsors.map(
                        (sponsor) => sponsor.name,
                      )}
                      colors={sponsorColorsArray}
                    />
                  </div>

                  <div className="space-y-1">
                    {leaderboardSponsors.map((sponsor) => (
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
          <BarChart
            className="my-2"
            data={leagues[leaderboardVersion].map((league) => ({
              Players: users.filter((user) => league === user.league).length,
              name: league,
            }))}
            index="name"
            categories={["Players"]}
            colors={["#d31f3c"]}
            valueFormatter={(v) => v.toLocaleString("en")}
            showAnimation
            animationDuration={400}
            customTooltip={({ label, payload }) => {
              const amount = payload?.[0]?.value;
              return (
                <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                  <span>
                    {leaderboard.name}{" "}
                    {leaderboard.features.includes("platformSelection") && (
                      <span> - {platformName}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{label}</span>
                    {leagues[leaderboardVersion].includes(label as string) && (
                      <LeagueImage league={label as string} size={30} />
                    )}
                  </div>

                  <Separator />

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
