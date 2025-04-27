import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';

const Login = () => {
  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // form validation state
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    forgotEmail: ''
  });

  // get auth context
  const { signIn, resetPassword, loading, error } = useAuth();

  const navigate = useNavigate();

  // validation helpers
  const validateEmail = (email) => {
    // basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateField = (field, value) => {
    if (!value.trim()) {
      return `${field} is required`;
    }
    
    if (field === 'Email' && !validateEmail(value)) {
      return 'Please enter a valid email address';
    }
    
    return '';
  };

  // handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // validate form fields
    const emailError = validateField('Email', email);
    const passwordError = validateField('Password', password);
    
    setFormErrors({
      ...formErrors,
      email: emailError,
      password: passwordError
    });
    
    // if any validation errors, stop submission
    if (emailError || passwordError) {
      return;
    }
    
    const { error } = await signIn(email, password, rememberMe);
    
    if (!error) {
      // reset form on success
      setEmail('');
      setPassword('');
      setFormErrors({ email: '', password: '', forgotEmail: '' });

      // redirect to app
      navigate('/', { replace: true });
    }
  };

  // handle password reset request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // validate forgot email field
    const forgotEmailError = validateField('Email', forgotEmail);
    
    setFormErrors({
      ...formErrors,
      forgotEmail: forgotEmailError
    });
    
    // if validation error, stop submission
    if (forgotEmailError) {
      return;
    }
    
    await resetPassword(forgotEmail);
    setResetEmailSent(true);
  };

  // toggle between login and forgot password
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetEmailSent(false);
    // clear errors when switching forms
    setFormErrors({ email: '', password: '', forgotEmail: '' });
  };

  // toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // input change handlers
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // clear the error when user types
    if (formErrors.email) {
      setFormErrors({ ...formErrors, email: '' });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    // clear the error when user types
    if (formErrors.password) {
      setFormErrors({ ...formErrors, password: '' });
    }
  };

  const handleForgotEmailChange = (e) => {
    const value = e.target.value;
    setForgotEmail(value);
    // clear the error when user types
    if (formErrors.forgotEmail) {
      setFormErrors({ ...formErrors, forgotEmail: '' });
    }
  };

  // error message component for form fields
  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    
    return (
      <div className="flex items-center mt-1 text-sm text-red-600">
        <AlertCircle size={14} className="mr-1" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 mx-auto rounded-xl shadow-lg bg-white border border-gray-200">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600">
            PT.RIAUJAYA
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            POS System
          </p>
        </div>

        {showForgotPassword ? (
          /* forgot password form */
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                Forgot password?
              </h2>
              <p className="text-sm text-gray-500">
                No worries, we'll send you reset instructions</p>
            </div>
            
            {resetEmailSent ? (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Reset password link sent! Check your email.
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label 
                    htmlFor="forgotEmail" 
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="forgotEmail"
                      type="email"
                      value={forgotEmail}
                      onChange={handleForgotEmailChange}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border ${formErrors.forgotEmail ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    />
                  </div>
                  <ErrorMessage message={formErrors.forgotEmail} />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'hang on...' : 'Reset password'}
                </button>
                
                {error && (
                  <div className="p-3 mt-3 text-sm flex items-center text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </form>
            )}
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
          </div>
        ) : (
          /* login form */
          <div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label 
                  htmlFor="email" 
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className={`${formErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${formErrors.email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                <ErrorMessage message={formErrors.email} />
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={18} className={`${formErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border ${formErrors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <ErrorMessage message={formErrors.password} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={toggleForgotPassword}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
              
              {error && (
                <div className="p-3 mt-3 text-sm flex items-center text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">
                  Need an account? Please contact your administrator to create a new user account.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
