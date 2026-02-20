import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const value = useMemo(() => ({
    darkMode,
    background: darkMode ? "#111827" : "#ffffff",
    text: darkMode ? "#f9fafb" : "#111827",
    cardBg: darkMode ? "#1f2937" : "#f3f4f6",
    toggleTheme: () => setDarkMode(prev => !prev)
  }), [darkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}