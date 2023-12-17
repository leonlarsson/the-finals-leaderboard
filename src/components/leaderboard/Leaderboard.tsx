import {useEffect, useMemo, useState} from "react";
import { Button, Popover, Space, Table, Typography } from "antd";
import { ColumnType } from "antd/es/table";
import closedBeta1Data from "../../data/leaderboard-closed-beta-1.json";
import closedBeta2Data from "../../data/leaderboard-closed-beta-2.json";
import openBetaData from "../../data/leaderboard-open-beta-1.json";
import Icons from "./../icons";
import Stats from "./Stats";
import fameToLeague from "../../helpers/fameToLeague";
import { LEADERBOARD_VERSION, VERSION_LEAGUES } from "../../helpers/leagues";
import fameToRankIcon from "../../helpers/fameToRankIcon";
import { RawUser, User } from "../../types";
import {Filter, LeaderboardFilters, Platform} from "./LeaderboardFilters";
import {filterUsers} from "./helper.ts";
import {LeaderboardUrlParams} from "./types";

type Props = {
  leaderboardVersion: LEADERBOARD_VERSION;
};

export const Leaderboard = ({ leaderboardVersion }: Props) => {
  const [filters, setFilters] = useState<Filter>(() => {
    const url = new URLSearchParams(window.location.search)

    return {
      user: url.get(LeaderboardUrlParams.USER) ?? undefined,
      platforms: (url.get(LeaderboardUrlParams.PLATFORMS)?.split(",") ?? []) as Platform[]
    }
  })
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const usersToShow = useMemo(() => {
    const { user, platforms } = filters

    const url = new URL(window.location.href)

    if (user) url.searchParams.set(LeaderboardUrlParams.USER, user)
    else url.searchParams.delete(LeaderboardUrlParams.USER)

    if (platforms.length > 0) url.searchParams.set(LeaderboardUrlParams.PLATFORMS, platforms.join(","))
    else url.searchParams.delete(LeaderboardUrlParams.PLATFORMS)

    history.pushState({}, "", url.href)


    return users.filter(user => filterUsers(user, filters))
  }, [users, filters])

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
      setLoading(false);
      return;
    }

    if (leaderboardVersion === "closedBeta2") {
      const initialUsers = transformData(closedBeta2Data);
      setUsers(initialUsers);
      setLoading(false);
      return;
    }

    if (leaderboardVersion === "openBeta") {
      const initialUsers = transformData(openBetaData);
      setUsers(initialUsers);
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

  useEffect(() => {
    fetchData();
  }, []);

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

  const columns = useMemo(() => [
    {
      title: "Rank",
      dataIndex: "rank",
      render: (rank: number, _: any, i: number) => filters.platforms.length > 0 ? `${i + 1} (${rank.toLocaleString("en-US")})` : rank.toLocaleString("en-US"),
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
          {fameToRankIcon(leaderboardVersion, fame)}{" "}
          {fame.toLocaleString("en-US")}
        </span>
      ),
      filters: [
        ...VERSION_LEAGUES[leaderboardVersion].map(league => ({
          text: league.name,
          value: league.name,
        })),
      ].reverse(),
      onFilter: (value: string, record: User) =>
        value === fameToLeague(leaderboardVersion, record.fame),
      sorter: (a: User, b: User) => a.fame - b.fame,
    },
  ].filter(column => column !== false) as ColumnType<User>[],
  [filters])

  return (
    <Space className="w-full" direction="vertical">
      <LeaderboardFilters filters={filters} onChange={setFilters} />
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

          <Stats leaderboardVersion={leaderboardVersion} users={users} />
        </Space>
      )}
    </Space>
  );
};
