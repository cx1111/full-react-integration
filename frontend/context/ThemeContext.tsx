import React from "react";

// Theme data and callbacks
interface ThemeProps {
  themeName: string;
  toggleThemeName: () => void;
}

const initialProps: ThemeProps = {
  themeName: "light",
  toggleThemeName: () => {},
};

export const ThemeContext = React.createContext<ThemeProps>(initialProps);

ThemeContext.displayName = "ThemeContext";

// Custom provider to implement auth state
export const ThemeProvider: React.FC = ({ children }) => {
  const [themeName, setThemeName] = React.useState<string>("light");

  React.useEffect(() => {
    // Load from localstorage if valid
    const initialThemeName = localStorage.getItem("FRI_THEME") || "light";
    setThemeName(initialThemeName);
  }, []);

  const toggleThemeName = () => {
    setThemeName((previousThemeName: string) => {
      if (previousThemeName === "light") {
        return "dark";
      }
      return "light";
    });
  };

  const value = { themeName, toggleThemeName };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
