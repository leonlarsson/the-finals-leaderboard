import { AlertCircleIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import noStoreFetch from "@/utils/noStoreFetch";

const Notice = () => {
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
      const res = await noStoreFetch(
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
    refetchInterval: 1000 * 60, // 1 minute
  });

  if (!data || !data.message) return null;

  return (
    <div className="my-1 flex items-center gap-2 rounded-md bg-brand-red p-1 text-white">
      <span className="*:size-5 *:flex-shrink-0">
        <AlertCircleIcon />
      </span>
      {data.message}
    </div>
  );
};

export default Notice;
