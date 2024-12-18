import { cn } from "@/lib/utils";
import { CSSProperties } from "react";

type SponsorImageProps = {
  sponsor: string;
  useIcon?: boolean;
  size?: number;
};

const sponsors = ["holtow", "iseul-t", "engimo", "dissun", "vaiiya"];

type SponsorStyle = Record<
  string,
  Record<"regular" | "icon", Record<string, CSSProperties>>
>;

const styles = {
  holtow: {
    regular: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
    icon: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
  },
  "iseul-t": {
    regular: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
    icon: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
  },
  engimo: {
    regular: {
      light: {
        backgroundColor: "bg-brand-red",
        padding: "p-1",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
    icon: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
  },
  dissun: {
    regular: {
      light: {
        backgroundColor: "bg-brand-red",
        padding: "p-1",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
    icon: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
  },
  vaiiya: {
    regular: {
      light: {
        backgroundColor: "bg-brand-red",
        padding: "p-1",
      },
      dark: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
    },
    icon: {
      light: {
        backgroundColor: "bg-inherit",
        padding: "p-0",
      },
      dark: {
        backgroundColor: "bg-white",
        padding: "p-0",
      },
    },
  },
} satisfies SponsorStyle;

export default ({
  sponsor,
  useIcon,
  size = useIcon ? 20 : 60,
}: SponsorImageProps) => {
  if (!sponsors.includes(sponsor.toLowerCase())) {
    return null;
  }

  // @ts-ignore I don't care right now
  const style = styles[sponsor.toLowerCase()][useIcon ? "icon" : "regular"];

  return (
    <img
      className={cn(
        "inline",
        style.light.backgroundColor,
        `dark:${style.dark.backgroundColor}`,
        style.light.padding,
        `dark:${style.dark.padding}`,
      )}
      draggable={false}
      title={`${sponsor} sponsor`}
      width={size}
      alt={`${sponsor} sponsor`}
      src={`/images/sponsors/sponsor-${sponsor.toLowerCase()}${useIcon ? "-icon" : ""}.png`}
    />
  );
};
