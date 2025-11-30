import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem('theme');
        if (theme === 'dark') {
          setIsDarkMode(true);
        }
      } catch (error) {
        console.error('Failed to load theme from AsyncStorage', error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
