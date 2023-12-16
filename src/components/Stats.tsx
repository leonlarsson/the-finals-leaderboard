import { Collapse, Divider, Space, Typography } from "antd";
import { LEADERBOARD_VERSION, VERSION_LEAGUES } from "../helpers/leagues";
import fameToLeague from "../helpers/fameToLeague";
import fameToRankIcon from "../helpers/fameToRankIcon";
import { User } from "../types";

type Props = {
  leaderboardVersion: LEADERBOARD_VERSION;
  users: User[];
};
export default ({ leaderboardVersion, users }: Props) => {
  return (
    <Collapse>
      <Collapse.Panel key={1} header="Stats">
        <Space className="w-full" direction="vertical" size={2}>
          <Divider className="!mb-0" orientation="left">
            Out of the top {users.length.toLocaleString("en-US")} players...
          </Divider>

          {/* LEAGUES */}
          {VERSION_LEAGUES[leaderboardVersion].map(league => {
            const usersInLeague = users.filter(
              user =>
                league.name === fameToLeague(leaderboardVersion, user.fame),
            ).length;

            return (
              <span key={league.name}>
                <Typography.Text code>
                  {usersInLeague.toLocaleString("en-US")} (
                  {(usersInLeague / users.length).toLocaleString("en-US", {
                    style: "percent",
                    maximumFractionDigits: 1,
                  })}
                  )
                </Typography.Text>{" "}
                {usersInLeague === 1 ? "is" : "are"} in {league.name} league{" "}
                {fameToRankIcon(leaderboardVersion, league.fame, 50)}
              </span>
            );
          })}

          {/* AVERAGES */}
          <Divider className="!mb-0" orientation="left">
            Averages
          </Divider>

          {leaderboardVersion === "closedBeta1" && (
            <span>
              Average XP:{" "}
              <Typography.Text code>
                {(
                  users.map(user => user.xp!).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </Typography.Text>
            </span>
          )}

          {leaderboardVersion === "closedBeta1" && (
            <span>
              Average Level:{" "}
              <Typography.Text code>
                {(
                  users.map(user => user.level!).reduce((a, b) => a + b, 0) /
                  users.length
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </Typography.Text>
            </span>
          )}

          <span>
            Average Cashouts:{" "}
            <Typography.Text code>
              {(
                users.map(user => user.cashouts).reduce((a, b) => a + b, 0) /
                users.length
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              })}
            </Typography.Text>
          </span>

          <span>
            Average Fame:{" "}
            <Typography.Text code>
              {(
                users.map(user => user.fame).reduce((a, b) => a + b, 0) /
                users.length
              ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </Typography.Text>
          </span>
        </Space>
      </Collapse.Panel>
    </Collapse>
  );
};
