import React from 'react';

const ManageHeader = ({ colors, title, subtitle }) => {
  return (
    <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-8`}>
      <h1 className={`text-3xl font-bold ${colors.textColor}`}>{title}</h1>
      {subtitle && <p className={`${colors.textMuted} mt-2`}>{subtitle}</p>}
    </div>
  );
};

export default ManageHeader;
