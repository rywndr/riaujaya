import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import NavigationLink from './NavLink';
import {
  Gauge,
  ShoppingCart,
  Clock,
  Menu,
  X,
  Settings
} from 'lucide-react';

// nav routes
const navigationRoutes = [
  { path: '/', label: 'Dashboard', icon: Gauge },
  { path: '/pos', label: 'POS', icon: ShoppingCart },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/manage', label: 'Manage', icon: Settings },
];

const Navigation = ({ colors, darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // check if current path matches the route
  const isActive = (path) => location.pathname === path;

  // toggle mobile menu open/closed
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`${colors.cardBg} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className={`ml-2 font-bold text-xl ${colors.textColor}`}>PT.RIAUJAYA CEMERLANG</span>
              </div>
            </Link>
          </div>

          {/* desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigationRoutes.map((route) => (
              <NavigationLink
                key={route.path}
                to={route.path}
                icon={route.icon}
                label={route.label}
                isActive={isActive(route.path)}
                colors={colors}
                isMobile={false}
              />
            ))}
          </div>

          {/* user profile */}
          <div className="hidden md:flex items-center">
            <ProfileDropdown 
              user={user} 
              signOut={signOut} 
              darkMode={darkMode} 
              toggleDarkMode={toggleDarkMode} 
              colors={colors}
              isMobile={false}
            />
          </div>

          {/* mobile menu */}
          <div className="md:hidden ml-2">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${colors.textColor} hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationRoutes.map((route) => (
                <div key={route.path} className="py-1">
                  <NavigationLink
                    to={route.path}
                    icon={route.icon}
                    label={route.label}
                    isActive={isActive(route.path)}
                    onClick={closeMobileMenu}
                    colors={colors}
                    isMobile={true}
                  />
                </div>
              ))}
              
              {/* profile dropdown in mobile menu */}
              <ProfileDropdown 
                user={user} 
                signOut={signOut} 
                darkMode={darkMode} 
                toggleDarkMode={toggleDarkMode} 
                colors={colors}
                isMobile={true}
                closeMenu={closeMobileMenu}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
