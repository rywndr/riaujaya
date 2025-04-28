import { useState, useEffect } from 'react';

const useColorClasses = (initialMode = null) => {

  const [darkMode, setDarkMode] = useState(() => {
    // check localStorage first for user preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return JSON.parse(savedMode);

    // check for system dark mode preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const colors = {
    // backgrounds
    appBg: darkMode ? 'bg-zinc-900' : 'bg-zinc-50',
    cardBg: darkMode ? 'bg-zinc-800/90' : 'bg-white',
    
    // text colors
    textColor: darkMode ? 'text-zinc-100' : 'text-zinc-900',
    textMuted: darkMode ? 'text-zinc-400' : 'text-zinc-500',
    textSecondary: darkMode ? 'text-zinc-300' : 'text-zinc-700',
    
    // borders and dividers
    border: darkMode ? 'border-zinc-700' : 'border-zinc-200',
    divider: darkMode ? 'border-zinc-700/70' : 'border-zinc-200/70',
    
    // table styling
    tableBg: darkMode ? 'bg-zinc-800' : 'bg-zinc-50',
    tableText: darkMode ? 'text-zinc-200' : 'text-zinc-800',
    tableHover: darkMode ? 'hover:bg-zinc-700/70' : 'hover:bg-blue-50/70',
    tableHeaderBg: darkMode ? 'bg-zinc-800' : 'bg-zinc-100',
    
    // form elements
    inputBg: darkMode ? 'bg-zinc-800/70' : 'bg-white',
    inputBorder: darkMode ? 'border-zinc-600' : 'border-zinc-300',
    inputFocus: darkMode ? 'focus:border-blue-500 focus:ring-blue-500/30' : 'focus:border-blue-500 focus:ring-blue-500/40',
    
    // buttons
    buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    buttonSecondary: darkMode 
      ? 'bg-zinc-700 text-zinc-100 hover:bg-zinc-600 active:bg-zinc-600/80' 
      : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300 active:bg-zinc-300/80',
    buttonOutline: darkMode
      ? 'border border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500'
      : 'border border-zinc-300 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400',
    
    // interactive elements
    productBg: darkMode ? 'hover:bg-zinc-700/70' : 'hover:bg-blue-50/70',
    activeLink: darkMode ? 'text-blue-400' : 'text-blue-600',
    
    // shadows
    shadow: darkMode ? 'shadow-md shadow-black/20' : 'shadow-md shadow-black/5',
    shadowLg: darkMode ? 'shadow-lg shadow-black/30' : 'shadow-lg shadow-black/10',
    
    // status colors
    success: darkMode ? 'text-green-400' : 'text-green-600',
    warning: darkMode ? 'text-amber-400' : 'text-amber-600',
    error: darkMode ? 'text-red-400' : 'text-red-600',
    info: darkMode ? 'text-blue-400' : 'text-blue-600',
    
    // transitions
    transition: 'transition-all duration-200',
  };
  
  // toggle darkmode and save to localstorage
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };
  
  // listen for system preference changes
  useEffect(() => {
    // create media query to detect preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // handle system preference change
    const handleChange = (e) => {
      // only update if no user preference is saved
      if (!localStorage.getItem('darkMode')) {
        setDarkMode(e.matches);
      }
    };
    
    // add listener for system preference changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // cleanup listener on unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // set dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return { colors, darkMode, toggleDarkMode };
};

export default useColorClasses;
