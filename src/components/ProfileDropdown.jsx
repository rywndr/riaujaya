import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

const ProfileDropdown = ({ user, signOut, darkMode, toggleDarkMode, colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // handle toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // handle sign out
  const handleSignOut = async () => {
    await signOut();
  };
  
  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* profile button */}
      <button 
        onClick={toggleDropdown}
        className={`flex items-center justify-center p-2 rounded-full ${colors.buttonSecondary} transition-colors duration-200`}
        aria-label="User menu"
      >
        <User size={20} className={colors.textColor} />
      </button>
      
      {/* dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-56 py-2 ${colors.cardBg} ${colors.border} border rounded-md shadow-lg z-50`}>
          {/* user email */}
          <div className="px-4 py-2 border-b border-opacity-30 border-gray-400">
            <p className={`text-sm font-medium ${colors.textColor}`}>
              {user?.email}
            </p>
          </div>
          
          {/* theme toggle  */}
          <div className="px-4 py-2 border-b border-opacity-30 border-gray-400 flex justify-between items-center">
            <span className={`text-sm ${colors.textColor}`}>{ darkMode ? "Light" : "Dark"  }</span>
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
          
          {/* sign out button */}
          <div className="px-4 py-2">
            <button
              onClick={handleSignOut}
              className={`w-full text-left px-3 py-2 rounded text-sm ${colors.buttonDangerBg || 'bg-red-600'} ${colors.buttonDangerText || 'text-white'} hover:opacity-90`}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
