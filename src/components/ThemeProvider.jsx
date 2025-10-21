import React, { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

const ThemeProvider = ({ children }) => {
  const { darkMode, primaryColor, fontFamily } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Appliquer les variables CSS
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--font-family', fontFamily);
    
    // Appliquer le mode sombre
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [darkMode, primaryColor, fontFamily]);

  return <div style={{ fontFamily }}>{children}</div>;
};

export default ThemeProvider;