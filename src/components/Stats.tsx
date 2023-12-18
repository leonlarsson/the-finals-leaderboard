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
      case "crossplay":
        return "Crossplay";
      case "steam":
        return "Steam";
      case "xbox":
        return "Xbox";
      case "psn":
        return "PlayStation";
      default:
        return "Crossplay";
    }
  };

  const platformName = getPlatformName(platform);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-neutral-200 rounded p-2 text-xl">
          Stats ({platformName})
        </AccordionTrigger>

        <AccordionContent className="text-sm p-2 bg-neutral-100">
          <div className="flex flex-col gap-2">
            {/* AVERAGES */}
            <span className="underline text-lg">Averages</span>

            {leaderboardVersion === "closedBeta1" && (
              <span>
                Average XP:{" "}
                <code className="bg-neutral-200 p-1 rounded">
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
                <code className="bg-neutral-200 p-1 rounded">
                  {(
                    users.map(user => user.level!).reduce((a, b) => a + b, 0) /
                    users.length
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </code>
              </span>
            )}

            <span>
              Average Cashouts:{" "}
              <code className="bg-neutral-200 p-1 rounded">
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
              <code className="bg-neutral-200 p-1 rounded">
                {(
                  users.map(user => user.fame).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </code>
            </span>
          </div>

          <hr className="my-2 border-black/30" />

          <span className="underline text-lg">
            Out of the top {users.length.toLocaleString("en")} players...
          </span>

          <div className="flex flex-col">
            {/* LEAGUES */}
            {VERSION_LEAGUES[leaderboardVersion].map(league => {
              const usersInLeague = users.filter(
                user =>
                  league.name === fameToLeague(leaderboardVersion, user.fame)
              ).length;

              return (
                <span key={league.name}>
                  <code className="bg-neutral-200 p-1 rounded">
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
