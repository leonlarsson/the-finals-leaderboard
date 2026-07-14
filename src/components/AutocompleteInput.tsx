import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import type { KeyboardEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

// Debounced async-search dropdown for a text Input. Selecting fills the value via getLabel and fires onSelect.
export const AutocompleteInput = <T,>({
  value,
  onChange,
  onSelect,
  onEnter,
  placeholder,
  className,
  queryKeyPrefix,
  fetchItems,
  getKey,
  getLabel,
  renderItem,
  minChars = 2,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: T) => void;
  onEnter?: () => void;
  placeholder?: string;
  className?: string;
  queryKeyPrefix: string;
  fetchItems: (query: string, signal: AbortSignal) => Promise<T[]>;
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  minChars?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), 250);
    return () => clearTimeout(timer);
  }, [value]);

  const trimmed = debouncedValue.trim();
  const enabled = isOpen && trimmed.length >= minChars;

  const query = useQuery({
    queryKey: [queryKeyPrefix, trimmed],
    queryFn: ({ signal }) => fetchItems(trimmed, signal),
    enabled,
    staleTime: 60_000,
  });

  const items = enabled ? (query.data ?? []) : [];

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query.data]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: T) => {
    onChange(getLabel(item));
    onSelect(item);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isOpen && items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, items.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(items[highlightedIndex]);
        return;
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
    }
    if (e.key === "Enter") {
      setIsOpen(false);
      onEnter?.();
    }
  };

  const showDropdown = isOpen && trimmed.length >= minChars;

  return (
    <div ref={containerRef} className="relative">
      <Input
        className={className}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {showDropdown && (query.isFetching || items.length > 0) && (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {query.isFetching && items.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">
              Searching...
            </div>
          )}

          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`block w-full px-3 py-1.5 text-left text-sm transition-colors ${
                i === highlightedIndex
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
              }`}
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
