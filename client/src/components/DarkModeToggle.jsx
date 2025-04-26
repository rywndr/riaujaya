import React from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className={`relative inline-flex items-center h-6 rounded-full w-11 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'} transition-colors focus:outline-none`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">{darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
      <span
        className={`${
          darkMode ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out relative`}
      >
        {!darkMode && <Sun size={12} className="text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
        {darkMode && <Moon size={12} className="text-gray-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
      </span>
    </button>
  );
};

export default DarkModeToggle;
