import React, { useState } from 'react';
import { Lock, Shield, Loader, Eye, EyeOff } from 'lucide-react';

const PasswordForm = ({ formData, handleChange, changePassword, isLoading, colors }) => {
  // state for password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // toggle password visibility functions
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
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
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted} hover:${colors.textColor} focus:outline-none`}
              onClick={toggleCurrentPasswordVisibility}
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="newPassword">
            New password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted} hover:${colors.textColor} focus:outline-none`}
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="confirmPassword">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.textMuted} hover:${colors.textColor} focus:outline-none`}
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
  );
};

export default PasswordForm;
