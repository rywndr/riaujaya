import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader } from 'lucide-react';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { validateEmail } from '../../utils/validation';
import { useFormValidation } from '../../hooks/useFormValidation';
import { StatusMessage } from '../UI/StatusMessage';
import { AppLogo } from '../UI/AppLogo';

const Login = () => {
  // state for form visibility and messages
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  
  // custom hooks
  const { signIn, resetPassword, loading, error } = useAuth();
  const navigate = useNavigate();
  
  // form validation setup
  const { formErrors, validateForm } = useFormValidation({
    email: (val) => validateEmail(val),
    password: (val) => val.trim() ? '' : 'Password is required',
    forgotEmail: (val) => validateEmail(val)
  });

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

  // toggle between login and forgot password
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetEmailSent(false);
    setMessage({ type: '', text: '' });
  };

  // handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // validate form fields
    const isValid = validateForm({
      email,
      password
    });
    
    // if any validation errors, stop submission
    if (!isValid) return;
    
    const { error } = await signIn(email, password, rememberMe);
    
    if (!error) {
      // reset form on success
      setEmail('');
      setPassword('');
      
      // redirect to app
      navigate('/', { replace: true });
    }
  };

  // handle password reset request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // validate forgot email field
    const isValid = validateForm({
      forgotEmail
    });
    
    // if validation error, stop submission
    if (!isValid) return;
    
    await resetPassword(forgotEmail);
    setResetEmailSent(true);
    setMessage({ 
      type: 'success', 
      text: 'Reset password link sent! Check your email.' 
    });
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
        
        {showForgotPassword ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Forgot password?
              </h2>
              <p className="text-sm text-gray-500">
                No worries, we'll send you reset instructions
              </p>
            </div>
            
            {message.text && <StatusMessage message={message} />}
            
            {resetEmailSent ? (
              <div className="flex items-center justify-center mt-4">
                <button
                  type="button"
                  onClick={toggleForgotPassword}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  <span>Back to log in</span>
                </button>
              </div>
            ) : (
              <>
                <ForgotPasswordForm
                  forgotEmail={forgotEmail}
                  setForgotEmail={setForgotEmail}
                  formErrors={formErrors}
                  onSubmit={handleResetPassword}
                />
                
                <div className="flex items-center justify-center mt-4">
                  <button
                    type="button"
                    onClick={toggleForgotPassword}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-600 transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    <span>Back to log in</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {message.text && <StatusMessage message={message} />}
            
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              toggleForgotPassword={toggleForgotPassword}
              formErrors={formErrors}
              onSubmit={handleLogin}
              loading={loading}
            />
            
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                Need an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">Register here</Link> or contact your administrator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
