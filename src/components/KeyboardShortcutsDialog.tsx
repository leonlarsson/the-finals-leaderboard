import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const shortcuts = [
  { key: "⌘ K", description: "Open player search" },
  { key: "/", description: "Focus name filter" },
  { key: "← →", description: "Navigate pages" },
  { key: "Esc", description: "Clear / close" },
];

export function KeyboardShortcutsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0 rounded-full text-sm font-semibold shadow-md"
          title="Keyboard shortcuts"
        >
          ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xs font-saira">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {description}
              </span>
              <kbd className="shrink-0 rounded border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-800">
                {key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
