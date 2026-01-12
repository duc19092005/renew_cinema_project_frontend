import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'web3';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Lấy theme từ localStorage hoặc mặc định là dark
    const savedTheme = localStorage.getItem('theme') as Theme;
    return (savedTheme && ['light', 'dark', 'web3'].includes(savedTheme)) ? savedTheme : 'dark';
  });

  useEffect(() => {
    // Lưu theme vào localStorage
    localStorage.setItem('theme', theme);
    // Áp dụng theme vào document root
    document.documentElement.classList.remove('light', 'dark', 'web3');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
