import React from 'react';
import { User, Save, Loader } from 'lucide-react';

const ProfileForm = ({ formData, handleChange, updateProfile, isLoading, colors }) => {
  return (
    <form onSubmit={updateProfile}>
      <h2 className={`text-xl font-semibold mb-4 ${colors.textColor} flex items-center`}>
        <User size={20} className="mr-2" />
        My Profile
      </h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="fullName">
            Full name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${colors.textSecondary} mb-1`} htmlFor="email">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled
            className={`w-full px-3 py-2 rounded-lg border ${colors.inputBorder} ${colors.inputBg} ${colors.textMuted} bg-opacity-50 cursor-not-allowed`}
          />
          <p className={`text-xs ${colors.textMuted} mt-1`}>
            email cannot be changed. contact support for assistance.
          </p>
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
          <Save size={16} className="mr-2" />
        )}
        Save profile
      </button>
    </form>
  );
};

export default ProfileForm;
