import { Link } from "@tanstack/react-router";
import { UserRoundIcon, UsersRoundIcon } from "lucide-react";

export const SearchNavLinks = ({
  exclude,
}: {
  exclude?: "players" | "clubs";
}) => (
  <>
    {exclude !== "players" && (
      <Link
        to="/players"
        className="flex w-fit items-center gap-1 text-sm text-neutral-500 hover:underline"
      >
        <UserRoundIcon size={16} /> Player Search
      </Link>
    )}
    {exclude !== "clubs" && (
      <Link
        to="/clubs"
        className="flex w-fit items-center gap-1 text-sm text-neutral-500 hover:underline"
      >
        <UsersRoundIcon size={16} /> Club Search
      </Link>
    )}
  </>
);
