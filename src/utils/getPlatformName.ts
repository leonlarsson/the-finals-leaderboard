import { Platforms } from "@/types";

export default (platform: Platforms) => {
  const platforms = {
    [Platforms.Crossplay]: "Crossplay",
    [Platforms.Steam]: "Steam",
    [Platforms.Xbox]: "Xbox",
    [Platforms.PSN]: "PlayStation",
  };

  return platforms[platform] ?? "Unknown";
};
