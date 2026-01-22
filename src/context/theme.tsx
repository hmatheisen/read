import { type FC, type ReactNode, createContext, use, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleTheme = () => {
    setTheme(prevState => (prevState === "light" ? "dark" : "light"));

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  };

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      <div className="bg-white text-black dark:bg-black dark:text-white m-0 p-0">{children}</div>
    </ThemeContext>
  );
};

export const useTheme = () => {
  const context = use(ThemeContext);

  return context;
};
