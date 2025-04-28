import React from 'react';

const TabButton = ({ isActive, onClick, icon: Icon, label, colors }) => {
  return (
    <button
      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
        isActive 
          ? `${colors.buttonPrimary}` 
          : `${colors.buttonOutline}`
      }`}
      onClick={onClick}
    >
      <Icon size={18} className="mr-2" />
      <span>{label}</span>
    </button>
  );
};

export default TabButton;
