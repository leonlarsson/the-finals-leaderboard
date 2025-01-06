import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export const ThemeToggle = () => {
  const { selectedTheme, setSelectedTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      title="Toggle theme"
      onClick={() =>
        setSelectedTheme(selectedTheme === "dark" ? "light" : "dark")
      }
    >
      <Sun className="!size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute !size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
