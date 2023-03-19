import { Button, Collapse, Divider, Image, Input, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import "./App.css";

const App = () => {

  const [users, setUsers] = useState([]);
  const [usersToShow, setUsersToShow] = useState(users);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getRankIcon = fame => {
    let league;
    if (fame < 500) league = "Bronze";
    if (fame >= 500) league = "Silver";
    if (fame >= 1000) league = "Gold";
    if (fame >= 5000) league = "Diamond";

    return <Image className="inline" title={`${league} league`} height={30} src={`/assets/images/${league.toLowerCase()}.png`} />
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://embark-discovery-leaderboard.storage.googleapis.com/leaderboard.json");

      if (res.ok) {
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
      render: fame => <>{getRankIcon(fame)} {fame.toLocaleString("en-US")}</>,
      sorter: (a, b) => a.fame - b.fame
    }
  ];

  return (
    <div className="container mb-12">
      <h1 className="text-4xl font-medium underline">THE FINALS - Unofficial Beta Leaderboard</h1>
      <h5 className="text-xl">Top {users.length.toLocaleString("en-US")} players from the current playtest. You can find the official leaderboard <a href="https://www.reachthefinals.com/leaderboard-beta" target="_blank" className="link">here</a>. Created by <a href="https://twitter.com/mozzyfx" target="_blank" className="link">me</a>.</h5>
      <hr />

      <Space className="w-full" direction="vertical">
        <Input size="large" placeholder="Search for a user" onChange={e => filterUsers(e.target.value)} />
        <Space>
          <Button disabled={loading} onClick={fetchData}>Refresh data</Button>
          <span>{usersToShow.length.toLocaleString("en-US")} {usersToShow.length === 1 ? "user" : "users"}</span>
        </Space>
        {error ?
          <h1>Error</h1>
          :
          <Space className="w-full" direction="vertical">
            <Table
              columns={columns}
              dataSource={usersToShow}
              scroll={{ x: true }}
              loading={loading}
            />

            <Collapse>
              <Collapse.Panel header="Stats">
                <Space className="w-full" direction="vertical">

                  <Divider className="!mb-0" orientation="left">Out of the top {users.length.toLocaleString("en-US")} players...</Divider>
                  <span><Typography.Text code>{users.filter(user => user.fame >= 5000).length.toLocaleString("en-US")} ({(users.filter(user => user.fame > 5000).length / users.length).toLocaleString("en-US", { style: "percent" })})</Typography.Text> are in {getRankIcon(5000)} Diamond league</span>
                  <span><Typography.Text code>{users.filter(user => user.fame >= 1000 && user.fame < 5000).length.toLocaleString("en-US")} ({(users.filter(user => user.fame > 1000 && user.fame < 5000).length / users.length).toLocaleString("en-US", { style: "percent" })})</Typography.Text> are in {getRankIcon(1000)} Gold league</span>
                  <span><Typography.Text code>{users.filter(user => user.fame < 1000 && user.fame >= 500).length.toLocaleString("en-US")} ({(users.filter(user => user.fame < 1000 && user.fame >= 500).length / users.length).toLocaleString("en-US", { style: "percent" })})</Typography.Text> are in {getRankIcon(500)} Silver league</span>
                  <span><Typography.Text code>{users.filter(user => user.fame < 500).length.toLocaleString("en-US")} ({(users.filter(user => user.fame < 500).length / users.length).toLocaleString("en-US", { style: "percent" })})</Typography.Text> are in {getRankIcon(499)} Bronze league</span>

                  <Divider className="!mb-0" orientation="left">Averages</Divider>
                  <span>Average XP: <Typography.Text code>{(users.map(user => user.xp).reduce((a, b) => a + b, 0) / users.length).toLocaleString("en-US", { maximumFractionDigits: 0 })}</Typography.Text></span>
                  <span>Average Level: <Typography.Text code>{(users.map(user => user.level).reduce((a, b) => a + b, 0) / users.length).toLocaleString("en-US", { maximumFractionDigits: 0 })}</Typography.Text></span>
                  <span>Average Cashouts: <Typography.Text code>{(users.map(user => user.cashouts).reduce((a, b) => a + b, 0) / users.length).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</Typography.Text></span>
                  <span>Average Fame: <Typography.Text code>{(users.map(user => user.fame).reduce((a, b) => a + b, 0) / users.length).toLocaleString("en-US", { maximumFractionDigits: 0 })}</Typography.Text></span>

                </Space>
              </Collapse.Panel>
            </Collapse>
          </Space>
        }
      </Space>
    </div>
  );
};

export default App;