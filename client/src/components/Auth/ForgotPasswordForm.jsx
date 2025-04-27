import React from 'react';
import { Mail } from 'lucide-react';
import { ErrorMessage } from '../UI/ErrorMessage';

const ForgotPasswordForm = ({
  forgotEmail,
  setForgotEmail,
  formErrors,
  onSubmit,
  loading
}) => {
  // input change handler
  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        {loading ? 'Hang on...' : 'Reset password'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
