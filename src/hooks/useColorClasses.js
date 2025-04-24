import { useState, useEffect } from 'react';

// theme colors for dark and light mode
const useColorClasses = (initialMode = false) => {
  const [darkMode, setDarkMode] = useState(initialMode);
  
  const colors = {
    appBg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    textColor: darkMode ? 'text-white' : 'text-black',
    textMuted: darkMode ? 'text-gray-300' : 'text-gray-500',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    tableBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    tableHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-50',
    inputBg: darkMode ? 'bg-gray-700' : 'bg-white',
    inputBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
    buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    productBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
  };

  // toggle darkmode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // set dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return { colors, darkMode, toggleDarkMode };
};

export default useColorClasses;
