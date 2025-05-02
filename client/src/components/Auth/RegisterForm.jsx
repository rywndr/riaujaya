import React from 'react';
import { Eye, EyeOff, Lock, Mail, User, Loader } from 'lucide-react';
import CommonUI from '../UI/CommonUI';

const RegisterForm = ({
  email,
  setEmail,
  fullName,
  setFullName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  togglePasswordVisibility,
  formErrors,
  onSubmit,
  loading
}) => {
  // input change handlers
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFullNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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
        <CommonUI.ErrorMessage message={formErrors.email} />
      </div>
      
      <div>
        <label 
          htmlFor="fullName" 
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User size={18} className={`${formErrors.fullName ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            placeholder="Enter your full name"
            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${formErrors.fullName ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>
        <CommonUI.ErrorMessage message={formErrors.fullName} />
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
            placeholder="Create a password"
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
        <CommonUI.ErrorMessage message={formErrors.password} />
      </div>
      
      <div>
        <label 
          htmlFor="confirmPassword" 
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className={`${formErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${formErrors.confirmPassword ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
        <CommonUI.ErrorMessage message={formErrors.confirmPassword} />
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Creating account...
          </div>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;