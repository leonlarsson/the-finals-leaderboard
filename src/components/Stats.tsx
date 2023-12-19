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
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="rounded bg-neutral-200 p-2 text-xl">
          Stats ({platformName})
        </AccordionTrigger>

        <AccordionContent className="bg-neutral-100 p-2 text-sm">
          <div className="flex flex-col gap-2">
            {/* AVERAGES */}
            <span className="text-lg underline">Averages</span>

            {leaderboardVersion === "closedBeta1" && (
              <span>
                Average XP:{" "}
                <code className="rounded bg-neutral-200 p-1">
                  {(
                    users.map(user => user.xp!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </code>
              </span>
            )}

            {leaderboardVersion === "closedBeta1" && (
              <span>
                Average Level:{" "}
                <code className="rounded bg-neutral-200 p-1">
                  {(
                    users.map(user => user.level!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </code>
              </span>
            )}

            <span>
              Average Cashouts:{" "}
              <code className="rounded bg-neutral-200 p-1">
                {(
                  users.map(user => user.cashouts).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </code>
            </span>

            <span>
              Average Fame:{" "}
              <code className="rounded bg-neutral-200 p-1">
                {(
                  users.map(user => user.fame).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </code>
            </span>
          </div>

          <hr className="my-2 border-black/30" />

          <span className="text-lg underline">
            Out of the top {users.length.toLocaleString("en")} players...
          </span>

          <div className="flex flex-col">
            {/* LEAGUES */}
            {VERSION_LEAGUES[leaderboardVersion].map(league => {
              const usersInLeague = users.filter(
                user =>
                  league.name === fameToLeague(leaderboardVersion, user.fame),
              ).length;

              return (
                <span key={league.name}>
                  <code className="rounded bg-neutral-200 p-1">
                    {usersInLeague.toLocaleString("en-US")} (
                    {(usersInLeague / users.length).toLocaleString("en-US", {
                      style: "percent",
                      maximumFractionDigits: 1,
                    })}
                    )
                  </code>{" "}
                  {usersInLeague === 1 ? "is" : "are"} in {league.name} league{" "}
                  {fameToRankIcon(leaderboardVersion, league.fame, 60)}
                </span>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
