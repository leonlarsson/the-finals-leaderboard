// Borrowed from https://ui.shadcn.com/docs/components/data-table#column-header

import { Column } from "@tanstack/react-table";
import { MenuIcon, SortAscIcon, SortDescIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <TooltipProvider>
        <Tooltip delayDuration={200} disableHoverableContent>
          <TooltipTrigger asChild className="w-fit">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 h-8 data-[state=open]:bg-accent"
              onClick={() => column.toggleSorting()}
            >
              <span>{title}</span>
              {column.getIsSorted() === "asc" ? (
                <SortAscIcon className="ml-2 size-4" />
              ) : column.getIsSorted() === "desc" ? (
                <SortDescIcon className="ml-2 size-4" />
              ) : (
                <MenuIcon className="ml-2 size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Click to{" "}
            {(() => {
              switch (column.getNextSortingOrder()) {
                case "asc":
                  return "sort ascending";
                case "desc":
                  return "sort descending";
                default:
                  return "clear sorting";
              }
            })()}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
