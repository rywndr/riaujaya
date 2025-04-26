import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import POSSystem from './components/POSSystem';
import TransactionHistory from './components/TransactionHistory';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';

// app with routing and auth context
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigation /><Dashboard /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><Navigation /><POSSystem /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Navigation /><TransactionHistory /></ProtectedRoute>} />
          
          {/* fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
