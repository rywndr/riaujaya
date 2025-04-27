import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { ErrorMessage } from '../UI/ErrorMessage';

const PasswordForm = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  togglePasswordVisibility,
  formErrors,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label 
          htmlFor="new-password" 
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          New password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className={`${formErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${formErrors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <ErrorMessage message={formErrors.password} />
      </div>
      
      <div>
        <label 
          htmlFor="confirm-password" 
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          Confirm password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock size={18} className={`${formErrors.confirm ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={`w-full pl-10 pr-10 py-2 rounded-lg border ${formErrors.confirm ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <ErrorMessage message={formErrors.confirm} />
      </div>
      
      <button 
        type="submit" 
        className="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Change password
      </button>
    </form>
  );
};

export default PasswordForm;
