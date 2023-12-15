import {
  Button,
  Collapse,
  Divider,
  Image,
  Input,
  Popover,
  Space,
  Table,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import closedBeta1Data from "../data/leaderboard-closed-beta-1.json";
import closedBeta2Data from "../data/leaderboard-closed-beta-2.json";
import openBetaData from "../data/leaderboard-open-beta-1.json";
import Icons from "./icons";
import { RawUser, User } from "../types";
import { ColumnType } from "antd/es/table";
import {fameToLeague, LEADERBOARD_VERSION} from "../helpers";

type Props = {
  leaderboardVersion: LEADERBOARD_VERSION;
};

const Leaderboard = ({ leaderboardVersion }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersToShow, setUsersToShow] = useState<User[]>(users);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getRankIcon = (fame: number, height?: number) => {
    const league = fameToLeague(leaderboardVersion, fame)

    return (
      <Image
        className="inline"
        title={`${league} league`}
        height={height ?? 50}
        src={`/images/${league.toLowerCase().replace(" ", "-")}.png`}
      />
    );
  };

  const transformData = (data: RawUser[]): User[] =>
    data.map(user => ({
      key: `${user.c}-${user.name}`,
      rank: user.r,
      change: user.or - user.r,
      name: user.name,
      steamName: user.steam,
      xboxName: user.xbox,
      psnName: user.psn,
      xp: user.x,
      level: user.mx,
      cashouts: user.c,
      fame: user.f,
    }));

  const fetchData = async () => {
    setLoading(true);

    if (leaderboardVersion === "closedBeta1") {
      const initialUsers = transformData(closedBeta1Data);
      setUsers(initialUsers);
      setUsersToShow(initialUsers);
      setLoading(false);
      return;
    }

    if (leaderboardVersion === "closedBeta2") {
      const initialUsers = transformData(closedBeta2Data);
      setUsers(initialUsers);
      setUsersToShow(initialUsers);
      setLoading(false);
      return;
    }

    if (leaderboardVersion === "openBeta") {
      const initialUsers = transformData(openBetaData);
      setUsers(initialUsers);
      setUsersToShow(initialUsers);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay-discovery-live.json",
      );
      // cb1: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard-beta-1.json
      // cb2: https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json
      // open beta: https://storage.googleapis.com/embark-discovery-leaderboard/leaderboard-crossplay.json

      if (res.ok) {
        const json = await res.json();
        const initialUsers = transformData(json);
        setUsers(initialUsers);
        setUsersToShow(initialUsers);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = (search: string) =>
    setUsersToShow(
      users.filter(user =>
        [user.name, user.steamName, user.xboxName, user.psnName].some(
          username => username?.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    );

  useEffect(() => {
    fetchData();
  }, []);

  const cb1leagues = [
    { name: "Diamond", min: 5000, max: Infinity },
    { name: "Gold", min: 1000, max: 4999 },
    { name: "Silver", min: 500, max: 999 },
    { name: "Bronze", min: 0, max: 499 },
  ];

  const cb2leagues = [
    { name: "Diamond 1", min: 23750, max: Infinity },
    { name: "Diamond 2", min: 22500, max: 23749 },
    { name: "Diamond 3", min: 21250, max: 22499 },
    { name: "Diamond 4", min: 20000, max: 21249 },
    { name: "Platinum 1", min: 18750, max: 19999 },
    { name: "Platinum 2", min: 17500, max: 18749 },
    { name: "Platinum 3", min: 16250, max: 17499 },
    { name: "Platinum 4", min: 15000, max: 16249 },
    { name: "Gold 1", min: 13750, max: 14999 },
    { name: "Gold 2", min: 12500, max: 13749 },
    { name: "Gold 3", min: 11250, max: 12499 },
    { name: "Gold 4", min: 10000, max: 11249 },
    { name: "Silver 1", min: 8750, max: 9999 },
    { name: "Silver 2", min: 7500, max: 8749 },
    { name: "Silver 3", min: 6250, max: 7499 },
    { name: "Silver 4", min: 5000, max: 6249 },
    { name: "Bronze 1", min: 3750, max: 4999 },
    { name: "Bronze 2", min: 2500, max: 3749 },
    { name: "Bronze 3", min: 1250, max: 2499 },
    { name: "Bronze 4", min: 0, max: 1249 },
  ];

  const namePopoverContent = (user: User) => {
    if (!user.steamName && !user.xboxName && !user.psnName) return;
    return (
      <Space direction="vertical">
        <span>
          <img src="/images/Embark.png" className="inline w-5 h-5" />{" "}
          <Typography.Text strong>Embark ID</Typography.Text>: {user.name}
        </span>
        {user.steamName && (
          <span>
            <Icons.steam className="h-5 w-5 inline" />{" "}
            <Typography.Text strong>Steam:</Typography.Text> {user.steamName}
          </span>
        )}
        {user.xboxName && (
          <span>
            <Icons.xbox className="h-5 w-5 inline" />{" "}
            <Typography.Text strong>Xbox:</Typography.Text> {user.xboxName}
          </span>
        )}
        {user.psnName && (
          <span>
            <Icons.playstation className="h-5 w-5 inline" />{" "}
            <Typography.Text strong>PlayStation:</Typography.Text>{" "}
            {user.psnName}
          </span>
        )}
      </Space>
    );
  };

  const platformNamesInline = (user: User) => {
    return (
      <Space direction="vertical">
        <span>{user.name}</span>
        {user.steamName && (
          <span>
            <Icons.steam className="h-5 w-5 inline opacity-60" />{" "}
            {user.steamName}
          </span>
        )}
        {user.xboxName && (
          <span>
            <Icons.xbox className="h-5 w-5 inline opacity-60" /> {user.xboxName}
          </span>
        )}
        {user.psnName && (
          <span>
            <Icons.playstation className="h-5 w-5 inline opacity-60" />{" "}
            {user.psnName}
          </span>
        )}
      </Space>
    );
  };

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      render: (rank: number) => rank.toLocaleString("en-US"),
      sorter: (a: User, b: User) => a.rank - b.rank,
    },
    {
      title: "24h change",
      dataIndex: "change",
      render: (change: number) => (
        <span
          style={{
            color: change > 0 ? "#20c520" : change < 0 ? "red" : "inherit",
          }}
        >
          {change > 0 ? `+${change}` : change}
        </span>
      ),
      sorter: (a: User, b: User) => a.change - b.change,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (name: string, user: User) =>
        ["openBeta", "live"].includes(leaderboardVersion) ? (
          <Popover content={namePopoverContent(user)}>
            {platformNamesInline(user)}
          </Popover>
        ) : (
          name
        ),
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    leaderboardVersion === "closedBeta1" && {
      title: "XP",
      dataIndex: "xp",
      render: (xp: number) => xp.toLocaleString("en-US"),
      sorter: (a: User, b: User) => a.xp! - b.xp!, // These exist in version 1
    },
    leaderboardVersion === "closedBeta1" && {
      title: "Level",
      dataIndex: "level",
      render: (level: number) => level.toLocaleString("en-US"),
      sorter: (a: User, b: User) => a.level! - b.level!, // These exist in version 1
    },
    {
      title: "Cashouts",
      dataIndex: "cashouts",
      render: (cashouts: number) =>
        cashouts.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }),
      sorter: (a: User, b: User) => a.cashouts - b.cashouts,
    },
    {
      title: "Fame",
      dataIndex: "fame",
      render: (fame: number) => (
        <span>
          {getRankIcon(fame)} {fame.toLocaleString("en-US")}
        </span>
      ),
      filters: (leaderboardVersion === "closedBeta1"
        ? cb1leagues
        : cb2leagues
      ).map(league => ({
        text: league.name,
        value: `${league.min}:${league.max}`,
      })),
      onFilter: (value: string, record: User) => {
        const min = value.match(/(.*):/)?.[1];
        const max = value.match(/:(.*)/)?.[1];
        return (
          record.fame >= parseInt(min ?? "0") &&
          record.fame <= parseInt(max ?? "0")
        );
      },
      sorter: (a: User, b: User) => a.fame - b.fame,
    },
  ].filter(column => column !== false) as ColumnType<User>[];

  return (
    <Space className="w-full" direction="vertical">
      <Input
        size="large"
        placeholder="Search for a user"
        onChange={e => filterUsers(e.target.value)}
      />
      <Space>
        <Button disabled={loading} onClick={fetchData}>
          Refresh data
        </Button>
        <span>
          {usersToShow.length.toLocaleString("en-US")}{" "}
          {usersToShow.length === 1 ? "user" : "users"}
        </span>
      </Space>
      {error ? (
        <h1>Error</h1>
      ) : (
        <Space className="w-full" direction="vertical">
          <Table
            size="small"
            columns={columns}
            dataSource={usersToShow}
            scroll={{ x: true }}
            loading={loading}
          />

          <Collapse>
            <Collapse.Panel key={1} header="Stats">
              <Space className="w-full" direction="vertical" size={2}>
                <Divider className="!mb-0" orientation="left">
                  Out of the top {users.length.toLocaleString("en-US")}{" "}
                  players...
                </Divider>

                {(leaderboardVersion === "closedBeta1"
                  ? cb1leagues
                  : cb2leagues
                ).map(league => (
                  <span key={league.name}>
                    <Typography.Text code>
                      {users
                        .filter(
                          user =>
                            user.fame >= league.min && user.fame <= league.max,
                        )
                        .length.toLocaleString("en-US")}{" "}
                      (
                      {(
                        users.filter(
                          user =>
                            user.fame >= league.min && user.fame <= league.max,
                        ).length / users.length
                      ).toLocaleString("en-US", {
                        style: "percent",
                        maximumFractionDigits: 1,
                      })}
                      )
                    </Typography.Text>{" "}
                    {users.filter(
                      user =>
                        user.fame >= league.min && user.fame <= league.max,
                    ).length === 1
                      ? "is"
                      : "are"}{" "}
                    in {league.name} league {getRankIcon(league.max)}
                  </span>
                ))}

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
                        users
                          .map(user => user.level!)
                          .reduce((a, b) => a + b, 0) / users.length
                      ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </Typography.Text>
                  </span>
                )}
                <span>
                  Average Cashouts:{" "}
                  <Typography.Text code>
                    {(
                      users
                        .map(user => user.cashouts)
                        .reduce((a, b) => a + b, 0) / users.length
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
        </Space>
      )}
    </Space>
  );
};

export default Leaderboard;
