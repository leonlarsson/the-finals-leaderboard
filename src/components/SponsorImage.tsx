import { CSSProperties } from "react";
import { useTheme } from "./ThemeProvider";

type SponsorImageProps = {
  sponsor: string;
  useIcon?: boolean;
  size?: number;
};

const sponsors = new Set([
  "holtow",
  "iseul-t",
  "engimo",
  "dissun",
  "vaiiya",
  "alfa-acta",
  "ospuze",
]);

type SponsorStyle = Record<
  string,
  Record<"regular" | "icon", Record<"light" | "dark", CSSProperties>>
>;

const styles = {
  holtow: {
    regular: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
  "iseul-t": {
    regular: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
  engimo: {
    regular: {
      light: { backgroundColor: "#d31f3c", padding: 4 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
  dissun: {
    regular: {
      light: { backgroundColor: "#d31f3c", padding: 4 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
  vaiiya: {
    regular: {
      light: { backgroundColor: "#d31f3c", padding: 4 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "white", padding: 0 },
    },
  },
  "alfa-acta": {
    regular: {
      light: { backgroundColor: "#d31f3c", padding: 2 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      // Might go dark background for light theme
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
  ospuze: {
    regular: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
    icon: {
      light: { backgroundColor: "inherit", padding: 0 },
      dark: { backgroundColor: "inherit", padding: 0 },
    },
  },
} satisfies SponsorStyle;

export const SponsorImage = ({
  sponsor,
  useIcon,
  size = useIcon ? 20 : 60,
}: SponsorImageProps) => {
  const { selectedTheme } = useTheme();

  if (!sponsors.has(sponsor.toLowerCase())) {
    return null;
  }

  const style =
    styles[sponsor.toLowerCase() as keyof typeof styles][
      useIcon ? "icon" : "regular"
    ];

  return (
    <img
      style={selectedTheme === "light" ? style.light : style.dark}
      draggable={false}
      title={`${sponsor} sponsor`}
      width={size}
      alt={`${sponsor} sponsor`}
      src={`/images/sponsors/sponsor-${sponsor.toLowerCase()}${useIcon ? "-icon" : ""}.png`}
    />
  );
};
