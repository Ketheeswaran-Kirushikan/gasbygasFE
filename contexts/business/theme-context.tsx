"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '@/lib/db-service';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const updateTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      dbService.updateUser(userId, { theme: newTheme });
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      const user = dbService.users.find(u => u.id === userId);
      if (user) {
        updateTheme(user.theme);
        if (user && user.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      }
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

