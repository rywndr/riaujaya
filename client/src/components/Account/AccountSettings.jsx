import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabase/client';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import { StatusMessage } from '../UI/StatusMessage';
import UserSidebar from './UserSidebar';

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
        console.error('error loading user data:', err);
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
      console.error('error updating profile:', err);
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
      console.error('error changing password:', err);
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setIsLoading(false);
    }
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
      
      {message.text && <StatusMessage message={message} />}
      
      {/* settings content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* sidebar */}
        <UserSidebar 
          fullName={formData.fullName} 
          email={formData.email} 
          user={user} 
          colors={colors} 
        />
        
        {/* main content area */}
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 md:col-span-2`}>
          {/* profile form */}
          <ProfileForm 
            formData={formData}
            handleChange={handleChange}
            updateProfile={updateProfile}
            isLoading={isLoading}
            colors={colors}
          />
          
          {/* password form */}
          <div className={`mt-8 pt-8 border-t ${colors.divider}`}>
            <PasswordForm 
              formData={formData}
              handleChange={handleChange}
              changePassword={changePassword}
              isLoading={isLoading}
              colors={colors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
