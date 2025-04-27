import React from 'react';
import { User } from 'lucide-react';

const UserSidebar = ({ fullName, email, user, colors }) => {
  return (
    <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 h-fit`}>
      <div className="flex flex-col items-center text-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${colors.buttonSecondary} mb-4`}>
          <User size={32} className={colors.textColor} />
        </div>
        <h2 className={`text-xl font-semibold ${colors.textColor}`}>{fullName || 'User'}</h2>
        <p className={`${colors.textMuted} text-sm`}>{email}</p>
      </div>
      
      <div className={`pt-4 mt-4 border-t ${colors.divider}`}>
        <p className={`${colors.textMuted} text-sm`}>
          account created on {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default UserSidebar;
