import { MegaphoneIcon, MessageSquareWarningIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Linkify } from "./Linkify";
import { SECOND } from "@/utils/time";

export const Notice = () => {
  // Get initial data from localStorage to prevent flickering
  const initialData = () => {
    const data = localStorage.getItem("notice");
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return { type: null, message: null };
    }
  };

  const { data } = useQuery({
    queryKey: ["notice"],
    initialData: initialData(),
    queryFn: async () => {
      const res = await fetch(
        "https://api.the-finals-leaderboard.com/tfl-notice",
      );
      if (!res.ok) return null;

      const data = (await res.json()) as {
        type: string | null;
        message: string | null;
      };

      // Store in localStorage and return
      localStorage.setItem("notice", JSON.stringify(data));
      return data;
    },
    refetchInterval: SECOND * 30,
  });

  if (!data || !data.message) return null;

  return (
    <div className="my-1 flex items-center gap-2 rounded-md bg-brand-red p-1 text-white">
      <span className="*:size-5 *:flex-shrink-0">{getIcon(data.type)}</span>
      <Linkify text={data.message} />
    </div>
  );
};

const getIcon = (type: string) =>
  ({
    psa: <MegaphoneIcon />,
    warning: <MessageSquareWarningIcon />,
  })[type] ?? null;
