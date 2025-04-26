import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useColorClasses from '../hooks/useColorClasses';
import ProfileDropdown from './ProfileDropdown';
import {
  Gauge,
  ShoppingCart,
  Clock,
  Menu,
  X,
  Bike
} from 'lucide-react';

// navigation bar for the app
const Navigation = ({ user, signOut, darkMode, toggleDarkMode }) => {
  const { colors } = useColorClasses(false);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // check if the current path matches
  const isActive = (path) => location.pathname === path;

  // toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`${colors.cardBg} shadow-md mb-4`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* logo and company name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Bike className="h-8 w-8 text-blue-600" />
              <span className={`ml-2 font-bold text-xl ${colors.textColor}`}>PT.RIAUJAYA CEMERLANG</span>
            </div>
          </div>

          {/* desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
              }`}
            >
              <Gauge className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/pos"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/pos')
                  ? 'bg-blue-600 text-white'
                  : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
              }`}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              POS
            </Link>
            <Link
              to="/history"
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/history')
                  ? 'bg-blue-600 text-white'
                  : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
              }`}
            >
              <Clock className="mr-2 h-5 w-5" />
              Riwayat Transaksi
            </Link>
          </div>

          {/* user profile dropdown */}
          <div className="hidden md:block">
            <ProfileDropdown
              user={user}
              signOut={signOut}
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
              colors={colors}
            />
          </div>

          {/* mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md ${colors.textColor} hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/')
                    ? 'bg-blue-600 text-white'
                    : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Gauge className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/pos"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/pos')
                    ? 'bg-blue-600 text-white'
                    : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                POS
              </Link>
              <Link
                to="/history"
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/history')
                    ? 'bg-blue-600 text-white'
                    : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Clock className="mr-2 h-5 w-5" />
                Riwayat Transaksi
              </Link>
              {/* mobile profile dropdown */}
              <div className="border-t border-gray-200 my-2"></div>
              <ProfileDropdown
                user={user}
                signOut={signOut}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                colors={colors}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

