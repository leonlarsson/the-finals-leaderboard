import { Tabs } from "antd";
import { Leaderboard } from "./components/leaderboard";
import { LEADERBOARD_VERSION } from "./helpers/leagues";

import "./App.css";

const App = () => {
  return (
    <div className="container mb-12">
      <h1 className="text-4xl font-medium underline">
        Unofficial Leaderboard – THE FINALS
      </h1>
      <h5 className="text-xl">
        View leaderboards from THE FINALS and track your progress. Created by{" "}
        <a href="https://twitter.com/mozzyfx" target="_blank" className="link">
          Leon
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
            children: (
              <Leaderboard leaderboardVersion={LEADERBOARD_VERSION.LIVE} />
            ),
          },
          {
            key: "3",
            label: "Open Beta",
            children: (
              <Leaderboard leaderboardVersion={LEADERBOARD_VERSION.OPEN_BETA} />
            ),
          },
          {
            key: "2",
            label: "Closed Beta 2",
            children: (
              <Leaderboard
                leaderboardVersion={LEADERBOARD_VERSION.CLOSED_BETA_2}
              />
            ),
          },
          {
            key: "1",
            label: "Closed Beta 1",
            children: (
              <Leaderboard
                leaderboardVersion={LEADERBOARD_VERSION.CLOSED_BETA_1}
              />
            ),
          },
        ]}
      />

      <div className="mt-10">
        <span className="text-sm">
          All imagery and data is owned by Embark Studios.
        </span>
      </div>
    </div>
  );
};

export default App;
