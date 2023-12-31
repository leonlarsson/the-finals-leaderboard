import { createContext, useContext, useEffect, useState } from "react";
import { createTheme as createMuiTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
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
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  const muiTheme = createMuiTheme({
    palette: {
      mode:
        selectedTheme === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : selectedTheme === "dark"
            ? "dark"
            : "light",
    },
  });

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
      <MuiThemeProvider theme={muiTheme}>
      {children}
      </MuiThemeProvider>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
