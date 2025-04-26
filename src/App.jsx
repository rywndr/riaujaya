import React from 'react';
import POSSystem from './components/POSSystem';
import Login from './components/Auth/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import useColorClasses from './hooks/useColorClasses';

// main app content with auth check
const AppContent = () => {
  const { user, loading } = useAuth();
  const { colors, darkMode } = useColorClasses(false);
  
  // show loading state
  if (loading) {
    return (
      <div className={`w-full min-h-screen ${colors.appBg} flex items-center justify-center transition-colors duration-300`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className={colors.textColor}>Loading...</p>
        </div>
      </div>
    );
  }
  
  // show login if no user is authenticated
  if (!user) {
    return <Login colors={colors} />;
  }
  
  // show POS system if user is authenticated
  return <POSSystem />;
};

// wrap app with auth provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
