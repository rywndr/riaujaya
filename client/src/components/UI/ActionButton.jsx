import React from 'react';

const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary', colors, disabled = false, className = '' }) => {
  const getButtonStyles = () => {
    if (variant === 'primary') return colors.buttonPrimary;
    if (variant === 'secondary') return colors.buttonSecondary;
    if (variant === 'outline') return colors.buttonOutline;
    if (variant === 'danger') return 'bg-red-100 text-red-600 hover:bg-red-200';
    return colors.buttonPrimary;
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
