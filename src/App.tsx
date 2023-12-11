import { Tabs } from "antd";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

const App = () => {
  return (
    <div className="container mb-12">
      <h1 className="text-4xl font-medium underline">
        THE FINALS - Unofficial Leaderboard
      </h1>
      <h5 className="text-xl">
        All leaderboards from playtests, including launch. You can find the
        official leaderboard{" "}
        <a
          href="https://www.reachthefinals.com/leaderboard-beta"
          target="_blank"
          className="link"
        >
          here
        </a>
        . Created by{" "}
        <a href="https://twitter.com/mozzyfx" target="_blank" className="link">
          me
        </a>
        . Source{" "}
        <a
          href="https://github.com/leonlarsson/the-finals-leaderboard"
          target="_blank"
          className="link"
        >
          here
        </a>
        .
      </h5>
      <hr />

      <Tabs
        defaultActiveKey="4"
        items={[
          {
            key: "4",
            label: "Live",
            children: <Leaderboard leaderboardVersion={"live"} />,
          },
          {
            key: "3",
            label: "Open Beta",
            children: <Leaderboard leaderboardVersion={"openBeta"} />,
          },
          {
            key: "2",
            label: "Closed Beta 2",
            children: <Leaderboard leaderboardVersion={"closedBeta2"} />,
          },
          {
            key: "1",
            label: "Closed Beta 1",
            children: <Leaderboard leaderboardVersion={"closedBeta1"} />,
          },
        ]}
      />
    </div>
  );
};

export default App;
