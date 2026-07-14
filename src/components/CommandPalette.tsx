import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FavoriteStarButton } from "@/components/FavoriteStarButton";
import { useTheme } from "@/components/ThemeProvider";
import { useLeaderboardFavorites } from "@/hooks/useLeaderboardFavorites";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import {
  defaultLeaderboardId,
  leaderboards,
  Leaderboard,
  LeaderboardId,
} from "@/utils/leaderboards";
import { useNavigate } from "@tanstack/react-router";
import {
  ClockIcon,
  HomeIcon,
  ScaleIcon,
  StarIcon,
  SunMoonIcon,
  TrophyIcon,
  UserRoundIcon,
  UsersRoundIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const allLeaderboards = Object.values(leaderboards).filter((x) => x.enabled);

export const CommandPalette = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { selectedTheme, setSelectedTheme } = useTheme();
  const { history, addToHistory, removeFromHistory, clearHistory } =
    useSearchHistory();
  const { isLeaderboardFavorite, toggleLeaderboardFavorite } =
    useLeaderboardFavorites();

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    onOpenChange(!open);
  });

  const close = () => {
    onOpenChange(false);
    setQuery("");
  };

  // Search across all leaderboards on the /players route
  const handlePlayerSearch = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    navigate({ to: "/players", search: { q: trimmed, all: true } });
    close();
  };

  // Navigate directly to player profile — requires exact name (e.g. Name#1234)
  const handleProfile = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    navigate({ to: "/players/$playerName", params: { playerName: trimmed } });
    close();
  };

  const handleLeaderboardSelect = (id: LeaderboardId) => {
    navigate({
      to: "/",
      search: { lb: id === defaultLeaderboardId ? undefined : id },
    });
    close();
  };

  const navCommands = [
    {
      label: "Go to Leaderboard",
      icon: HomeIcon,
      onSelect: () => navigate({ to: "/" }),
    },
    {
      label: "Go to Players",
      icon: UserRoundIcon,
      onSelect: () => navigate({ to: "/players" }),
    },
    {
      label: "Go to Clubs",
      icon: UsersRoundIcon,
      onSelect: () => navigate({ to: "/clubs" }),
    },
    {
      label: "Go to Favorites",
      icon: StarIcon,
      onSelect: () => navigate({ to: "/favorites" }),
    },
    {
      label: "Go to Compare",
      icon: ScaleIcon,
      onSelect: () => navigate({ to: "/compare" }),
    },
    {
      label: "Toggle theme",
      icon: SunMoonIcon,
      onSelect: () =>
        setSelectedTheme(selectedTheme === "dark" ? "light" : "dark"),
    },
  ];

  const trimmedQuery = query.trim().toLowerCase();

  const favoriteLeaderboards = allLeaderboards.filter((lb) =>
    isLeaderboardFavorite(lb.id as LeaderboardId),
  );

  const matchedLeaderboards = trimmedQuery
    ? allLeaderboards
        .filter(
          (lb) =>
            lb.name.toLowerCase().includes(trimmedQuery) ||
            lb.nameShort.toLowerCase().includes(trimmedQuery),
        )
        .sort(
          (a, b) =>
            Number(isLeaderboardFavorite(b.id as LeaderboardId)) -
            Number(isLeaderboardFavorite(a.id as LeaderboardId)),
        )
    : [];

  const matchedNavCommands = trimmedQuery
    ? navCommands.filter((c) => c.label.toLowerCase().includes(trimmedQuery))
    : navCommands;

  const showFavoriteLeaderboards =
    !trimmedQuery && favoriteLeaderboards.length > 0;
  const showMatched = matchedLeaderboards.length > 0;
  const showSearchActions = query.trim().length > 0;
  const showNav = matchedNavCommands.length > 0;
  const showHistory = history.length > 0;

  const renderLeaderboardItem = (lb: Leaderboard) => {
    const favorited = isLeaderboardFavorite(lb.id as LeaderboardId);
    return (
      <CommandItem
        key={lb.id}
        // cmdk filters items by `value` against the typed query using its own
        // fuzzy matcher; embedding the raw query guarantees it always matches
        // here since these lists are already our own pre-filtered arrays.
        value={`${trimmedQuery} ${lb.name}`}
        onSelect={() => handleLeaderboardSelect(lb.id as LeaderboardId)}
      >
        <TrophyIcon className="mr-2 size-4 text-neutral-400" />
        <span className="flex-1">{lb.name}</span>
        <FavoriteStarButton
          favorited={favorited}
          onToggle={() => toggleLeaderboardFavorite(lb.id as LeaderboardId)}
          size="size-3.5"
          stopPropagation
        />
      </CommandItem>
    );
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search for a player, leaderboard, or command..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (
            e.key === "Enter" &&
            query.trim() &&
            !matchedLeaderboards.length
          ) {
            handlePlayerSearch(query.trim());
          }
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {showFavoriteLeaderboards && (
          <>
            <CommandGroup heading="Favorite leaderboards">
              {favoriteLeaderboards.map(renderLeaderboardItem)}
            </CommandGroup>
            {(showNav || showHistory) && <CommandSeparator />}
          </>
        )}

        {showMatched && (
          <>
            <CommandGroup heading="Leaderboards">
              {matchedLeaderboards.map(renderLeaderboardItem)}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {showSearchActions && (
          <>
            <CommandGroup heading="Search">
              <CommandItem onSelect={() => handlePlayerSearch(query.trim())}>
                <UserRoundIcon className="mr-2 size-4 text-neutral-400" />
                <span>Find players &ldquo;{query.trim()}&rdquo;</span>
                {matchedLeaderboards.length === 0 && (
                  <span className="ml-auto text-xs text-neutral-400">↵</span>
                )}
              </CommandItem>
              <CommandItem onSelect={() => handleProfile(query.trim())}>
                <UserRoundIcon className="mr-2 size-4 text-neutral-400" />
                <span>Open profile for &ldquo;{query.trim()}&rdquo;</span>
                <span className="ml-auto text-xs text-neutral-400">
                  exact match
                </span>
              </CommandItem>
            </CommandGroup>
            {(showNav || showHistory) && <CommandSeparator />}
          </>
        )}

        {showNav && (
          <>
            <CommandGroup heading="Navigate">
              {matchedNavCommands.map(({ label, icon: Icon, onSelect }) => (
                <CommandItem
                  key={label}
                  value={`${trimmedQuery} ${label}`}
                  onSelect={() => {
                    onSelect();
                    close();
                  }}
                >
                  <Icon className="mr-2 size-4 text-neutral-400" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>
            {showHistory && <CommandSeparator />}
          </>
        )}

        {showHistory && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between">
                <span>Recent searches</span>
                <button
                  className="font-normal text-neutral-400 hover:text-red-500"
                  onClick={() => clearHistory()}
                >
                  Clear all
                </button>
              </div>
            }
          >
            {history.map((name) => (
              <CommandItem key={name} onSelect={() => handlePlayerSearch(name)}>
                <ClockIcon className="mr-2 size-4 text-neutral-400" />
                <span className="flex-1">{name}</span>
                <button
                  className="shrink-0 text-neutral-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHistory(name);
                  }}
                  title="Remove from history"
                >
                  <XIcon className="size-3.5" />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};
