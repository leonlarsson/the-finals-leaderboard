import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

export const FavoriteStarButton = ({
  favorited,
  onToggle,
  size = "size-4",
  favoritedTitle = "Remove from favorites",
  unfavoritedTitle = "Add to favorites",
  stopPropagation = false,
  className,
}: {
  favorited: boolean;
  onToggle: () => void;
  size?: string;
  favoritedTitle?: string;
  unfavoritedTitle?: string;
  // Set when nested inside another clickable row (e.g. a cmdk CommandItem)
  // so the row's own click/select handler doesn't also fire.
  stopPropagation?: boolean;
  className?: string;
}) => (
  <button
    onClick={(e) => {
      if (stopPropagation) e.stopPropagation();
      onToggle();
    }}
    className={cn(
      "shrink-0 transition-colors",
      favorited
        ? "text-yellow-400 hover:text-yellow-500"
        : "text-neutral-400 hover:text-yellow-400",
      className,
    )}
    title={favorited ? favoritedTitle : unfavoritedTitle}
  >
    <StarIcon className={cn(size, favorited && "fill-current")} />
  </button>
);
