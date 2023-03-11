import { Button, Input, Space, Table } from "antd";
import { useEffect, useState } from "react";
import "./App.css";

export default () => {

  const [users, setUsers] = useState([]);
  const [usersToShow, setUsersToShow] = useState(users);
  const [loading, setLoading] = useState(false);

  const trophy = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ffd700" height="16" width="16"><path fillRule="evenodd" d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698 5 5 0 004.503 5.152 6 6 0 002.946 1.822A6.451 6.451 0 017.768 13H7.5A1.5 1.5 0 006 14.5V17h-.75C4.56 17 4 17.56 4 18.25c0 .414.336.75.75.75h10.5a.75.75 0 00.75-.75c0-.69-.56-1.25-1.25-1.25H14v-2.5a1.5 1.5 0 00-1.5-1.5h-.268a6.453 6.453 0 01-.684-2.202 6 6 0 002.946-1.822 5 5 0 004.503-5.152.75.75 0 00-.552-.698A31.804 31.804 0 0016 2.562v-.387a.75.75 0 00-.629-.74A33.227 33.227 0 0010 1zM2.525 4.422C3.012 4.3 3.504 4.19 4 4.09V5c0 .74.134 1.448.38 2.103a3.503 3.503 0 01-1.855-2.68zm14.95 0a3.503 3.503 0 01-1.854 2.68C15.866 6.449 16 5.74 16 5v-.91c.496.099.988.21 1.475.332z" clipRule="evenodd"></path></svg>

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json");
    const json = await res.json();

    const initialUsers = json.map(user => ({
      key: `${user.c}-${user.name}`,
      rank: user.r,
      change: user.or - user.r,
      name: user.name,
      xp: user.x,
      level: user.mx,
      cashouts: user.c,
      fame: user.f
    }));

    setUsers(initialUsers);
    setUsersToShow(initialUsers);
    setLoading(false);
  };

  const filterUsers = search => setUsersToShow(users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())));

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      render: rank => rank.toLocaleString("en-US"),
      sorter: (a, b) => a.rank - b.rank
    },
    {
      title: "24h change",
      dataIndex: "change",
      render: change => <span style={{ color: change > 0 ? "#20c520" : change < 0 ? "red" : null }}>{change > 0 ? `+${change}` : change}</span>,
      sorter: (a, b) => a.change - b.change
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "XP",
      dataIndex: "xp",
      render: xp => xp.toLocaleString("en-US"),
      sorter: (a, b) => a.xp - b.xp
    },
    {
      title: "Level",
      dataIndex: "level",
      render: level => level.toLocaleString("en-US"),
      sorter: (a, b) => a.level - b.level
    },
    {
      title: "Cashouts",
      dataIndex: "cashouts",
      render: cashouts => cashouts.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
      sorter: (a, b) => a.cashouts - b.cashouts
    },
    {
      title: "Fame",
      dataIndex: "fame",
      render: fame => <>{trophy} {fame.toLocaleString("en-US")}</>,
      sorter: (a, b) => a.fame - b.fame
    }
  ];

  return (
    <div style={{ marginBottom: "3rem" }} className="container">
      <h1 style={{ textDecorationLine: "underline" }}>THE FINALS - Unofficial Beta Leaderboard</h1>
      <h5>Top 10,000 users from the current playtest. You can find the official leaderboard <a href="https://www.reachthefinals.com/leaderboard-beta" target="_blank" className="link-dark">here</a>. Created by <a href="https://twitter.com/mozzyfx" target="_blank" className="link-dark">Mozzy</a>.</h5>
      <hr />

      <Space style={{ width: "100%" }} direction="vertical">
        <Input size="large" placeholder="Search for a user" onChange={e => filterUsers(e.target.value)} />
        <Button disabled={loading} onClick={fetchData}>Refresh data</Button>
        <Table
          columns={columns}
          dataSource={usersToShow}
          scroll={{ x: true }}
          loading={loading}
        />
      </Space>
    </div>
  );
};