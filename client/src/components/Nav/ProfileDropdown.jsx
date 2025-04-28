import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const ProfileDropdown = ({ user, signOut, darkMode, toggleDarkMode, colors, isMobile, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // toggle dropdown state
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  // handle user sign out
  const handleSignOut = async () => {
    await signOut();
    if (closeMenu) closeMenu(); 
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

  // handle clicking account settings link
  const handleAccountClick = () => {
    setIsOpen(false);
    if (closeMenu) closeMenu();
  };
  
  if (isMobile) {
    return (
      <div className="px-2 py-3">
        <div className={`px-4 py-3 mb-2 rounded-lg ${colors.cardBg} ${colors.border} border`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.buttonSecondary}`}>
              <User size={18} className={colors.textColor} />
            </div>
            <div>
              <p className={`text-sm font-medium ${colors.textColor}`}>
                {user?.email}
              </p>
              <Link
                to="/account"
                onClick={handleAccountClick}
                className={`text-xs hover:underline ${colors.textMuted}`}
              >
                Account settings
              </Link>
            </div>
          </div>
        </div>
        
        {/* theme toggle in mobile view */}
        <div className={`flex justify-between items-center px-3 py-2 mb-2 rounded-lg ${colors.cardBg} ${colors.border} border`}>
          <div className="flex items-center gap-2">
            {darkMode ? 
              <Moon size={16} className={colors.textMuted} /> : 
              <Sun size={16} className={colors.textMuted} />
            }
            <span className={`text-sm ${colors.textColor}`}>
              {darkMode ? "Dark mode" : "Light mode"}
            </span>
          </div>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        {/* sign out button */}
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                      ${colors.buttonOutline} ${colors.transition} hover:text-red-500
                      ${darkMode ? 'hover:border-red-500/30 hover:bg-red-500/10' : 'hover:border-red-500/20 hover:bg-red-50'}`}
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    );
  }
  
  // desktop dropdown version
  return (
    <div className="relative" ref={dropdownRef}>
      {/* profile button - with user avatar and email preview */}
      <button 
        onClick={toggleDropdown}
        className={`flex items-center gap-2 px-3 py-2 rounded-full ${colors.buttonOutline} ${colors.transition}`}
        aria-label="user menu"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.buttonSecondary}`}>
          <User size={16} className={colors.textColor} />
        </div>
        
        {/* show email preview on larger screens */}
        <span className={`hidden sm:block text-sm font-medium truncate max-w-[100px] ${colors.textColor}`}>
          {user?.email?.split('@')[0]}
        </span>
        
        <ChevronDown size={16} className={`${colors.textMuted} ${isOpen ? 'rotate-180' : 'rotate-0'} ${colors.transition}`} />
      </button>
      
      {/* dropdown menu */}
      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-64 py-1 ${colors.cardBg} ${colors.border} border rounded-lg ${colors.shadowLg} z-50 
                      animate-in fade-in duration-200 slide-in-from-top-5`}
        >
          {/* user profile section */}
          <div className={`px-4 py-3 border-b ${colors.divider}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.buttonSecondary}`}>
                <User size={18} className={colors.textColor} />
              </div>
              <div>
                <p className={`text-sm font-medium ${colors.textColor}`}>
                  {user?.email}
                </p>
                <Link
                  to="/account"
                  onClick={() => setIsOpen(false)}
                  className={`text-xs hover:underline ${colors.textMuted}`}
                >
                  Account settings
                </Link>
              </div>
            </div>
          </div>
          
          {/* theme toggle */}
          <div className={`px-4 py-2 border-b ${colors.divider}`}>
            <div className="flex justify-between items-center py-1">
              <div className="flex items-center gap-2">
                {darkMode ? 
                  <Moon size={16} className={colors.textMuted} /> : 
                  <Sun size={16} className={colors.textMuted} />
                }
                <span className={`text-sm ${colors.textColor}`}>
                  {darkMode ? "Dark mode" : "Light mode"}
                </span>
              </div>
              <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
          </div>

          {/* sign out */}
          <div className="px-4 py-1">
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                          ${colors.buttonOutline} ${colors.transition} hover:text-red-500
                          ${darkMode ? 'hover:border-red-500/30 hover:bg-red-500/10' : 'hover:border-red-500/20 hover:bg-red-50'}`}
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
