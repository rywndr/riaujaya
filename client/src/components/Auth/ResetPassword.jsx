import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';
import PasswordForm from './PasswordForm';
import { validatePassword, validateConfirmPassword } from '../../utils/validation';
import { useUrlToken } from '../../hooks/useUrlToken';
import { useFormValidation } from '../../hooks/useFormValidation';
import { StatusMessage } from '../UI/StatusMessage';
import { AppLogo } from '../UI/AppLogo';

const ResetPassword = () => {
  // state for password data and messages
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // custom hooks
  const { updatePassword, loading } = useAuth();
  const navigate = useNavigate();
  const isValidToken = useUrlToken();
  const { formErrors, validateForm } = useFormValidation({
    password: (val) => validatePassword(val),
    confirm: (val) => validateConfirmPassword(val, newPassword)
  });
  
  // redirect if no valid token found
  useEffect(() => {
    if (isValidToken === false) {
      setMessage({
        type: 'error',
        text: 'Invalid or expired password reset link'
      });
      
      // redirect after showing message
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [isValidToken, navigate]);
  
  // toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // validate form fields
    const isValid = validateForm({
      password: newPassword,
      confirm: confirmPassword
    });
    
    // if any validation errors, stop submission
    if (!isValid) return;
    
    try {
      const { error } = await updatePassword(newPassword);
      
      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update password'
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully!'
        });
        
        // redirect to login after success
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred'
      });
    }
  };
  
  // display loading state if loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto" />
            <p className="mt-4">loading data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-lg bg-white border border-gray-200">
        <AppLogo />
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Create new password
          </h2>
          <p className="text-sm text-gray-500">
            Your new password must be different from previous passwords
          </p>
        </div>
        
        {message.text && <StatusMessage message={message} />}
        
        <PasswordForm 
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          formErrors={formErrors}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
