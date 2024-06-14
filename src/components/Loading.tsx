import { Loader2Icon } from "lucide-react";

type LoadingProps = {
  justifyCenter?: boolean;
};
export default ({ justifyCenter }: LoadingProps) => (
  <span
    className={`flex items-center ${justifyCenter ? "justify-center" : ""} gap-1`}
  >
    <span>Loading</span>
    <Loader2Icon className="inline size-5 animate-spin" />
  </span>
);
