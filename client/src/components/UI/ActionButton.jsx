import React from 'react';

const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary', colors = {}, disabled = false, className = '' }) => {
  // default colors object with fallback values
  const defaultColors = {
    buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    buttonOutline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    buttonDanger: 'bg-red-100 text-red-600 hover:bg-red-200'
  };
  
  // merge provided colors with defaults
  const buttonColors = {
    ...defaultColors,
    ...colors
  };
  
  const getButtonStyles = () => {
    if (variant === 'primary') return buttonColors.buttonPrimary;
    if (variant === 'secondary') return buttonColors.buttonSecondary;
    if (variant === 'outline') return buttonColors.buttonOutline;
    if (variant === 'danger') return 'bg-red-100 text-red-600 hover:bg-red-200';
    return buttonColors.buttonPrimary;
  };
  
  return (
    <button
      className={`flex items-center justify-center py-2 px-4 rounded-lg ${getButtonStyles()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={18} className={label ? "mr-2" : ""} />}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
