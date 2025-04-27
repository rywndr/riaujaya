import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';

const AccountSettings = () => {
  const { colors } = useOutletContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // fetch user profile from supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setFormData(prev => ({
          ...prev,
          fullName: data?.full_name || '',
          email: user.email || '',
        }));
      } catch (err) {
        console.error('Error loading user data:', err);
        setMessage({ type: 'error', text: 'Failed to load user data' });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // update profile information
  const updateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });
      
      // update profile in supabase
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: formData.fullName })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    // validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    try {
      setIsLoading(true);
      setMessage({ type: '', text: '' });
      
      // update password in supabase
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) throw error;
      
      // clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setMessage({ type: 'success', text: 'Password changed successfully' });
    } catch (err) {
      console.error('Error changing password:', err);
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // show alert message
  const renderMessage = () => {
    if (!message.text) return null;
    
    const bgColor = message.type === 'success' 
      ? 'bg-green-100 dark:bg-green-900/30' 
      : 'bg-red-100 dark:bg-red-900/20';
    
    const textColor = message.type === 'success' 
      ? 'text-green-800 dark:text-green-300' 
      : 'text-red-800 dark:text-red-300';
    
    const Icon = message.type === 'success' ? CheckCircle : AlertCircle;
    
    return (
      <div className={`${bgColor} ${textColor} px-4 py-3 rounded-lg mb-6 flex items-center`}>
        <Icon size={18} className="mr-2 flex-shrink-0" />
        <span>{message.text}</span>
      </div>
    );
  };
  
  // loading state
  if (isLoading && !formData.email) {
    return (
      <div className={`w-full ${colors.pageBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto" />
          <p className="mt-4">loading account data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header section */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-8`}>
        <h1 className={`text-3xl font-bold ${colors.textColor}`}>Account Settings</h1>
        <p className={`${colors.textMuted} mt-2`}>Manage your profile and security preferences</p>
      </div>
      
      {renderMessage()}
      
      {/* settings content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* sidebar */}
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 h-fit`}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${colors.buttonSecondary} mb-4`}>
              <User size={32} className={colors.textColor} />
            </div>
            <h2 className={`text-xl font-semibold ${colors.textColor}`}>{formData.fullName || 'User'}</h2>
            <p className={`${colors.textMuted} text-sm`}>{formData.email}</p>
          </div>
          
          <div className={`pt-4 mt-4 border-t ${colors.divider}`}>
            <p className={`${colors.textMuted} text-sm`}>
              Account created on {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        
        {/* main content area */}
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 md:col-span-2`}>
          {/* profile form */}
          <form onSubmit={updateProfile}>
            <h2 className={`text-xl font-semibold mb-4 ${colors.textColor} flex items-center`}>
              <User size={20} className="mr-2" />
              My Profile
            </h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="fullName">
                  Full name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="email">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textMuted} bg-opacity-50 cursor-not-allowed`}
                />
                <p className={`text-xs ${colors.textMuted} mt-1`}>
                  Email cannot be changed. contact support for assistance.
                </p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center ${colors.transition}`}
            >
              {isLoading ? (
                <Loader size={16} className="animate-spin mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Save profile
            </button>
          </form>
          
          {/* password form */}
          <div className={`mt-8 pt-8 border-t ${colors.divider}`}>
            <form onSubmit={changePassword}>
              <h2 className={`text-xl font-semibold mb-4 ${colors.textColor} flex items-center`}>
                <Lock size={20} className="mr-2" />
                Change password
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="currentPassword">
                    Current password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="newPassword">
                    New password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="confirmPassword">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center ${colors.transition}`}
              >
                {isLoading ? (
                  <Loader size={16} className="animate-spin mr-2" />
                ) : (
                  <Shield size={16} className="mr-2" />
                )}
                Update password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
