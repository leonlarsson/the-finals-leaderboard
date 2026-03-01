import { queryOptions } from "@tanstack/react-query";
import { ClubsAPIData } from "./types";

export const clubsQueryOptions = queryOptions({
  queryKey: ["clubs"],
  queryFn: async () => {
    const url = new URL("https://api.the-finals-leaderboard.com/v1/clubs");
    // url.searchParams.append("clubTagFilter", clubTag);
    // url.searchParams.append("exactClubTag", "true");
    const res = await fetch(url.href);
    return (await res.json()) as ClubsAPIData[];
  },
  staleTime: 1000 * 60 * 2, // 2 minutes
});
