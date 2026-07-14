import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchInput = ({
  initialValue,
  placeholder,
  onSubmit,
  maxLength,
}: {
  initialValue: string;
  placeholder: string;
  onSubmit: (value: string) => void;
  maxLength?: number;
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => onSubmit(inputValue.trim());

  return (
    <div className="flex gap-2">
      <Input
        type="search"
        ref={inputRef}
        className="max-w-sm"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        maxLength={maxLength}
        autoFocus
      />
      <Button onClick={handleSubmit}>
        <SearchIcon className="mr-2 size-4" />
        Search
      </Button>
    </div>
  );
};
