import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme: Theme;
  storageKey: string;
};

type ThemeProviderState = {
  selectedTheme: Theme;
  setSelectedTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  selectedTheme: "system",
  setSelectedTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey,
  ...props
}: ThemeProviderProps) {
  // Remove old theme key
  localStorage.removeItem("vite-ui-theme");
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (selectedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(selectedTheme);
  }, [selectedTheme]);

  const value = {
    selectedTheme: selectedTheme,
    setSelectedTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setSelectedTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
