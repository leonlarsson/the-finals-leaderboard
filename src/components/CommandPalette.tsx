import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import {
  defaultLeaderboardId,
  leaderboards,
  LeaderboardId,
} from "@/utils/leaderboards";
import { useNavigate } from "@tanstack/react-router";
import { ClockIcon, SearchIcon, TrophyIcon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const allLeaderboards = Object.values(leaderboards).filter((x) => x.enabled);

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { history, addToHistory } = useSearchHistory();

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    setOpen((o) => !o);
  });

  // Search across all leaderboards on the /players route
  const handlePlayerSearch = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    navigate({ to: "/players", search: { q: trimmed, all: true } });
    setOpen(false);
    setQuery("");
  };

  // Navigate directly to player profile — requires exact name (e.g. Name#1234)
  const handleProfile = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addToHistory(trimmed);
    navigate({ to: "/players/$playerName", params: { playerName: trimmed } });
    setOpen(false);
    setQuery("");
  };

  const handleLeaderboardSelect = (id: LeaderboardId) => {
    navigate({
      to: "/",
      search: { lb: id === defaultLeaderboardId ? undefined : id },
    });
    setOpen(false);
    setQuery("");
  };

  const trimmedQuery = query.trim().toLowerCase();
  const matchedLeaderboards = trimmedQuery
    ? allLeaderboards.filter(
        (lb) =>
          lb.name.toLowerCase().includes(trimmedQuery) ||
          lb.nameShort.toLowerCase().includes(trimmedQuery),
      )
    : [];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search for a player or leaderboard..."
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
        {matchedLeaderboards.length > 0 && (
          <>
            <CommandGroup heading="Leaderboards">
              {matchedLeaderboards.map((lb) => (
                <CommandItem
                  key={lb.id}
                  // cmdk filters items by `value` against the typed query using its own
                  // fuzzy matcher; embedding the raw query guarantees it always matches
                  // here since `matchedLeaderboards` is already our own pre-filtered list.
                  value={`${trimmedQuery} ${lb.name}`}
                  onSelect={() =>
                    handleLeaderboardSelect(lb.id as LeaderboardId)
                  }
                >
                  <TrophyIcon className="mr-2 size-4 text-neutral-400" />
                  {lb.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {query.trim() && (
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
        )}

        {history.length > 0 && (
          <>
            {query.trim() && <CommandSeparator />}
            <CommandGroup heading="Recent searches">
              {history.map((name) => (
                <CommandItem
                  key={name}
                  onSelect={() => handlePlayerSearch(name)}
                >
                  <ClockIcon className="mr-2 size-4 text-neutral-400" />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {!query && history.length === 0 && (
          <CommandEmpty>
            <SearchIcon className="mx-auto mb-2 size-6 text-neutral-400" />
            Type a player name or leaderboard to search.
          </CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
