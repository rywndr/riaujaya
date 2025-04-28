import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import POSSystem from './components/POSSystem';
import TransactionHistory from './components/TransactionHistory';
import Dashboard from './components/Dashboard/MainDashboard';
import Login from './components/Auth/Login';
import ResetPassword from './components/Auth/ResetPassword';
import Manage from './components/Manage';
import AccountSettings from './components/Account/AccountSettings';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// app with routing and auth context
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* protected routes with shared layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POSSystem />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/account" element={<AccountSettings />} />
          </Route>
          
          {/* fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
