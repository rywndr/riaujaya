import React from 'react';
import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <Moon className="text-white" size={20} />
      ) : (
        <Sun className="text-gray-900" size={20} />
      )}
    </button>
  );
};

export default DarkModeToggle;
