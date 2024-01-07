import { BarChart } from "@tremor/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import fameToLeague from "@/helpers/fameToLeague";
import fameToRankIcon from "@/helpers/fameToRankIcon";
import { LEADERBOARD_VERSION, VERSION_LEAGUES } from "@/helpers/leagues";
import { Platforms, User } from "@/types";

type Props = {
  leaderboardVersion: LEADERBOARD_VERSION;
  platform: Platforms;
  users: User[];
};
export default ({ leaderboardVersion, platform, users }: Props) => {
  const getPlatformName = (platform: Platforms) => {
    switch (platform) {
      case Platforms.Crossplay:
        return "Crossplay";
      case Platforms.Steam:
        return "Steam";
      case Platforms.Xbox:
        return "Xbox";
      case Platforms.PSN:
        return "PlayStation";
      default:
        return "Crossplay";
    }
  };

  const platformName = getPlatformName(platform);

  return (
    <Accordion id="stats" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded-t bg-neutral-200 p-2 text-xl dark:bg-neutral-900">
          Stats and Rank Distribution ({platformName})
        </AccordionTrigger>

        <AccordionContent className="bg-neutral-100 p-2 text-sm dark:bg-neutral-900/50">
          <div className="flex flex-col gap-2">
            {/* AVERAGES */}
            <span className="text-lg font-medium">Averages</span>

            {leaderboardVersion === "closedBeta1" && (
              <span>
                Average XP:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map(user => user.xp!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}

            {leaderboardVersion === "closedBeta1" && (
              <span>
                Average Level:{" "}
                <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                  {(
                    users.map(user => user.level!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </span>
            )}

            <span>
              Average Cashouts:{" "}
              <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                {(
                  users.map(user => user.cashouts).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </span>
            </span>

            <span>
              Average Fame:{" "}
              <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                {(
                  users.map(user => user.fame).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </span>
          </div>

          <hr className="my-2 border-black/30 dark:border-white/30" />

          <span className="text-lg font-medium">
            Out of the top {users.length.toLocaleString("en")}{" "}
            {getPlatformName(platform)} players...
          </span>

          {/* BAR CHART */}
          <BarChart
            className="my-2"
            data={VERSION_LEAGUES[leaderboardVersion].map(league => ({
              Players: users.filter(
                user =>
                  league.name === fameToLeague(leaderboardVersion, user.fame),
              ).length,
              name: league.name,
            }))}
            index="name"
            categories={["Players"]}
            colors={["#d31f3c"]}
            valueFormatter={v => v.toLocaleString("en")}
            customTooltip={({ label, payload }) => {
              const amount = payload?.[0]?.value;
              return (
                <div className="flex flex-col gap-1 rounded-lg border bg-white p-2 text-sm dark:bg-black">
                  <span>{getPlatformName(platform)}</span>
                  <span className="font-medium">{label}</span>
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

          {/* LEAGUES */}
          <details>
            <summary className="w-fit cursor-pointer font-medium">
              The same, but in text form
            </summary>
            <div className="flex flex-col">
              {VERSION_LEAGUES[leaderboardVersion].map(league => {
                const usersInLeague = users.filter(
                  user =>
                    league.name === fameToLeague(leaderboardVersion, user.fame),
                ).length;

                return (
                  <span key={league.name}>
                    <span className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">
                      {usersInLeague.toLocaleString("en")} (
                      {(usersInLeague / users.length).toLocaleString("en", {
                        style: "percent",
                        maximumFractionDigits: 1,
                      })}
                      )
                    </span>{" "}
                    {usersInLeague === 1 ? "is" : "are"} in {league.name}{" "}
                    {fameToRankIcon(leaderboardVersion, league.fame, 60)}
                  </span>
                );
              })}
            </div>
          </details>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
