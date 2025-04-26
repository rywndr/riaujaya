import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useColorClasses from '../../hooks/useColorClasses';

const Login = () => {
  // form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // get color classes and dark mode functionality from custom hook
  const { colors } = useColorClasses(false);

  // get auth context
  const { signIn, resetPassword, loading, error } = useAuth();

  // handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    const { error } = await signIn(email, password);
    
    if (!error) {
      // reset form on success
      setEmail('');
      setPassword('');
    }
  };

  // handle password reset request
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      return;
    }
    
    await resetPassword(forgotEmail);
    setResetEmailSent(true);
  };

  // toggle between login and forgot password
  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetEmailSent(false);
  };

  // get input style based on color theme
  const inputStyle = `w-full p-2 mb-4 rounded border ${
    colors.inputBg || 'bg-white'
  } ${colors.inputBorder || 'border-gray-300'}`;

  // get button style based on color theme
  const buttonStyle = `w-full p-2 rounded font-bold ${
    colors.buttonBg || 'bg-blue-600'
  } ${colors.buttonText || 'text-white'} hover:opacity-90`;

  return (
    <div className={`max-w-md mx-auto p-6 mt-16 rounded shadow-lg ${colors.cardBg || 'bg-white'}`}>
      <div className="text-center mb-6">
        <h1 className={`text-3xl font-bold ${colors.textColor || 'text-gray-800'}`}>
          PT.RIAUJAYA
        </h1>
        <p className={`mt-2 ${colors.textSecondary || 'text-gray-600'}`}>
          POS System
        </p>
      </div>

      {showForgotPassword ? (
        /* forgot password form */
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${colors.textColor || 'text-gray-800'}`}>
            Reset Password
          </h2>
          
          {resetEmailSent ? (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              Reset password link sent! Check your email.
            </div>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label 
                  htmlFor="forgotEmail" 
                  className={`block mb-1 ${colors.textSecondary || 'text-gray-600'}`}
                >
                  Email Address
                </label>
                <input
                  id="forgotEmail"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={inputStyle}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={buttonStyle}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              {error && (
                <p className="mt-2 text-red-600">{error}</p>
              )}
              
              <p className="mt-4 text-center">
                <button
                  type="button"
                  onClick={toggleForgotPassword}
                  className={`${colors.linkColor || 'text-blue-600'} hover:underline`}
                >
                  Back to Login
                </button>
              </p>
            </form>
          )}
        </div>
      ) : (
        /* login form */
        <div>
          <h2 className={`text-xl text-center font-semibold mb-4 ${colors.textColor || 'text-gray-800'}`}>
            LOGIN
          </h2>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label 
                htmlFor="email" 
                className={`block mb-1 ${colors.textSecondary || 'text-gray-600'}`}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={inputStyle}
                required
              />
            </div>
            
            <div className="mb-2">
              <label 
                htmlFor="password" 
                className={`block mb-1 ${colors.textSecondary || 'text-gray-600'}`}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={inputStyle}
                required
              />
            </div>
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={toggleForgotPassword}
                className={`${colors.linkColor || 'text-blue-600'} text-sm hover:underline`}
              >
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              className={buttonStyle}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            {error && (
              <p className="mt-2 text-red-600">{error}</p>
            )}
            
            <div className={`mt-4 p-3 rounded ${colors.noticeBg || 'bg-gray-100'}`}>
              <p className={`text-sm ${colors.textSecondary || 'text-gray-600'}`}>
                Need an account? Please contact your administrator to create a new user account.
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
