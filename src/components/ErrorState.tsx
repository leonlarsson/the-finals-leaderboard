import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorState = ({
  title = "Failed to load data",
  message = "Something went wrong while fetching data. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-start gap-3">
    <div className="flex items-center gap-2 text-red-500">
      <AlertCircleIcon className="size-5" />
      <span className="font-medium">{title}</span>
    </div>

    <p className="text-sm text-neutral-500">{message}</p>

    <Button variant="outline" size="sm" onClick={onRetry}>
      Try again
    </Button>
  </div>
);
