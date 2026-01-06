import { createContext, use, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleTheme = () => {
    setTheme(prevState => (prevState === "light" ? "dark" : "light"));

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  };

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      <div className="bg-white text-black dark:bg-black dark:text-white">{children}</div>
    </ThemeContext>
  );
};

export const useTheme = () => {
  const context = use(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
