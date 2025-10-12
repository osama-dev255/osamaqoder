import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark'; // Only dark theme

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void; // Keep for compatibility but it won't toggle
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Always dark

  useEffect(() => {
    // Always set to dark mode
    setTheme('dark');
  }, []);

  useEffect(() => {
    // Apply dark theme to document
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Save theme to localStorage
    localStorage.setItem('theme', 'dark');
  }, [theme]);

  const toggleTheme = () => {
    // Do nothing - theme is always dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}