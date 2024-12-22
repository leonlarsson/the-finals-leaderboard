import { platforms } from "@/types";

export default (platform: string) => {
  const platformsMap = {
    [platforms.CROSSPLAY]: "Crossplay",
    [platforms.STEAM]: "Steam",
    [platforms.XBOX]: "Xbox",
    [platforms.PSN]: "PlayStation",
  };

  return platformsMap[platform] ?? "Unknown";
};
