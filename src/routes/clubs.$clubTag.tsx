import { clubsQueryOptions } from "@/queries";
import { panels } from "@/types";
import { leaderboards } from "@/utils/leaderboards";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { ReactNode } from "react";

export const Route = createFileRoute("/clubs/$clubTag")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clubTag } = Route.useParams();

  const query = useQuery(clubsQueryOptions);

  if (query.isLoading) {
    return <PageWrapper>Loading a lot of data...</PageWrapper>;
  }

  if (query.isError || !query.data) {
    return <PageWrapper>An error happened :(</PageWrapper>;
  }

  const club = query.data.find(
    (x) => x.clubTag.toLowerCase() === clubTag.toLowerCase(),
  );

  if (!club) {
    return (
      <PageWrapper>
        Club not found. This means that there are no players in the top 10K in
        this club. Try again later.
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <div>
          Club Page
          <div className="text-4xl font-medium">{club.clubTag}</div>
          <div>
            <span className="font-medium">{club.clubTag}</span> has{" "}
            {club.members.length.toLocaleString("en")}{" "}
            {club.members.length === 1 ? "member" : "members"} in the top 10K of
            any leaderboard.
          </div>
        </div>

        <div>
          <span className="font-medium">Club Standings:</span>
          <div className="flex flex-col gap-1">
            {club.leaderboards.map(
              (leaderboard: {
                leaderboard: string;
                rank: number;
                totalValue: number;
              }) => (
                <Link
                  key={leaderboard.leaderboard}
                  to="/"
                  search={{
                    lb: apiIdToWebId(leaderboard.leaderboard),
                    panel: panels.CLUBS,
                    clubTag: `exactCt:${club.clubTag}`,
                  }}
                  className="mr-1 w-fit rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <span className="text-lg font-medium">
                    {Object.values(leaderboards).find(
                      (x) => x.id === apiIdToWebId(leaderboard.leaderboard),
                    )?.name ??
                      `Unknown leaderboard (${leaderboard.leaderboard})`}
                  </span>{" "}
                  | <span>Rank #{leaderboard.rank}</span> |{" "}
                  <span>
                    Combined points:{" "}
                    {leaderboard.totalValue.toLocaleString("en")}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>

        <div>
          <span className="font-medium">Club Players:</span>
          <div className="flex flex-wrap gap-1">
            {club.members
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((member) => (
                <Link
                  key={member.name}
                  to="/"
                  search={{ name: member.name }}
                  className="mr-1 cursor-pointer rounded bg-neutral-200 px-1 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  {member.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

const apiIdToWebId = (lb: string): string =>
  ({
    s8: "season8",
    s8sponsor: "season8Sponsor",
    s8worldtour: "season8WorldTour",
    s8head2head: "season8Head2Head",
    s8powershift: "season8PowerShift",
    s8quickcash: "season8QuickCash",
    s8teamdeathmatch: "season8TeamDeathmatch",
    s8heavenorelse: "season8HeavenOrElse",
    s7: "season7",
    s7sponsor: "season7Sponsor",
    s7worldtour: "season7WorldTour",
    s7terminalattack: "season7TerminalAttack",
    s7powershift: "season7PowerShift",
    s7quickcash: "season7QuickCash",
    s7teamdeathmatch: "season7TeamDeathmatch",
    s7blastoff: "season7BlastOff",
    s7cashball: "season7CashBall",
    s6: "season6",
    s6sponsor: "season6Sponsor",
    s6worldtour: "season6WorldTour",
    s6terminalattack: "season6TerminalAttack",
    s6powershift: "season6PowerShift",
    s6quickcash: "season6QuickCash",
    s6teamdeathmatch: "season6TeamDeathmatch",
    s6heavyhitters: "season6HeavyHitters",
    s5: "season5",
    s5sponsor: "season5Sponsor",
    s5worldtour: "season5WorldTour",
    s5terminalattack: "season5TerminalAttack",
    s5powershift: "season5PowerShift",
    s5quickcash: "season5QuickCash",
    s5bankit: "season5BankIt",
  })[lb] ?? "Unknown";

const PageWrapper = ({ children }: { children: ReactNode }) => (
  <div className="my-4">
    <div>
      <Link
        to="/"
        search={(prev) => ({ ...prev, panel: panels.CLUBS })}
        className="mb-2 flex w-fit items-center gap-1 font-medium hover:underline"
      >
        <ArrowLeftIcon size={20} /> Back to leaderboards
      </Link>
    </div>
    {children}
  </div>
);
