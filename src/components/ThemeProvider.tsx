import { LocalStorage } from "@/constants/localStorage";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDark: true
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);



export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(LocalStorage.Theme) as Theme) || defaultTheme
  );

  const [isDark, setIsDark] = useState(() => {
    if (theme === "dark") return true;

    if (theme === "light") return false;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const matchesDarkTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = matchesDarkTheme ? "dark" : "light";

      setIsDark(matchesDarkTheme);

      root.classList.add(systemTheme);
      return;
    }

    setIsDark(theme === "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    isDark,
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(LocalStorage.Theme, theme);
      setTheme(theme);
    }
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
