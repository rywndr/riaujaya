import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import useColorClasses from '../hooks/useColorClasses';

const Layout = () => {
  const { colors, darkMode, toggleDarkMode } = useColorClasses(false);
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${colors.appBg}`}>
        <Navigation 
          colors={colors} 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
        <main className="p-4 max-w-7xl mx-auto">
          <Outlet context={{ colors, darkMode, toggleDarkMode }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
