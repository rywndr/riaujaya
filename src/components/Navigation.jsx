import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useColorClasses from '../hooks/useColorClasses';

// navigation bar for the app
const Navigation = () => {
  const { colors } = useColorClasses(false);
  const location = useLocation();
  
  // check if the current path matches
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className={`${colors.cardBg} shadow-md mb-4`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto py-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              isActive('/') 
                ? 'bg-blue-600 text-white' 
                : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
            }`}
          >
            POS
          </Link>
          
          <Link
            to="/history"
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              isActive('/history') 
                ? 'bg-blue-600 text-white' 
                : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`
            }`}
          >
            Riwayat Transaksi
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
