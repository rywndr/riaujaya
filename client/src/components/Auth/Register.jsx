import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader } from 'lucide-react';
import RegisterForm from './RegisterForm';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validation';
import { useFormValidation } from '../../hooks/useFormValidation';
import { StatusMessage } from '../UI/StatusMessage';
import { AppLogo } from '../UI/AppLogo';
import { supabase } from '../../supabase/client';

const Register = () => {
  // registration form state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  // redirect state
  const [inviteToken, setInviteToken] = useState(null);
  
  // custom hooks
  const { signUp, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // form validation setup
  const { formErrors, validateForm } = useFormValidation({
    email: (val) => validateEmail(val),
    fullName: (val) => val.trim() ? '' : 'Full name is required',
    password: (val) => validatePassword(val),
    confirmPassword: (val) => validateConfirmPassword(val, password)
  });

  // check for invite token in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setInviteToken(token);
      // attempt to get email from token
      checkInviteToken(token);
    }
  }, [location]);

  // check the invite token
  const checkInviteToken = async (token) => {
    try {
      // verify token through supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'invite'
      });
      
      if (error) {
        throw error;
      }
      
      if (data && data.email) {
        setEmail(data.email);
        setMessage({ type: 'info', text: 'Complete your registration to accept the invitation' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Invalid or expired invitation' });
    }
  };
  
  // handle form errors from auth context
  useEffect(() => {
    if (error) {
      setMessage({ type: 'error', text: error });
    }
  }, [error]);

  // toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // handle registration submit
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // validate form fields
    const isValid = validateForm({
      email,
      fullName,
      password,
      confirmPassword
    });
    
    // if any validation errors, stop submission
    if (!isValid) return;
    
    try {
      // sign up with email and password
      const { error, data } = await signUp(email, password, {
        emailRedirectTo: `${window.location.origin}/login`
      });
      
      if (error) {
        throw error;
      }
      
      // create or update user profile with full name
      if (data && data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            email: email
          });
          
        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }
      
      // registration successful
      setRegistrationComplete(true);
      setMessage({ 
        type: 'success', 
        text: 'Registration successful! Please check your email to confirm your account.' 
      });
      
      // reset form
      setEmail('');
      setFullName('');
      setPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Registration failed' });
    }
  };

  if (loading && !registrationComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto" />
            <p className="mt-4">processing your request...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-lg bg-white border border-gray-200">
        <AppLogo />
        
        {registrationComplete ? (
          <div className="text-center mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Registration Complete
              </h2>
              <p className="text-gray-600">
                Please check your email to confirm your account. Once verified, you can log in to your account.
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Create your account
              </h2>
              <p className="text-sm text-gray-500">
                {inviteToken ? 'Complete your account setup' : 'Register for a new account'}
              </p>
            </div>
            
            {message.text && <StatusMessage message={message} />}
            
            <RegisterForm
              email={email}
              setEmail={setEmail}
              fullName={fullName}
              setFullName={setFullName}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              showConfirmPassword={showConfirmPassword}
              toggleConfirmPasswordVisibility={toggleConfirmPasswordVisibility}
              formErrors={formErrors}
              onSubmit={handleRegister}
              loading={loading}
            />
            
            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center text-sm text-gray-500 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Already have an account? Log in</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;