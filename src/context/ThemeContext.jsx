import { createContext, useState, useEffect, useContext } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Always use dark theme
  const getInitialTheme = () => {
    return 'dark';
  };

  // State to track the current theme (always dark)
  const [theme, setTheme] = useState(getInitialTheme);

  // Update theme attribute on document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Toggle function is kept for compatibility but doesn't change the theme
  const toggleTheme = () => {
    // Theme is always dark, so this function does nothing
    console.log('Theme is restricted to dark mode');
  };

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
