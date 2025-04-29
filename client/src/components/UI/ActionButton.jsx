import React from 'react';

const ActionButton = ({ onClick, icon: Icon, label, variant = 'primary', colors = {}, disabled = false, className = '', title }) => {
  // default colors object with fallback values
  const defaultColors = {
    buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonSecondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    buttonOutline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    buttonDanger: 'bg-red-100 text-red-600 hover:bg-red-200',
    textColor: 'text-gray-700'
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
    if (variant === 'success') return 'bg-green-100 text-green-600 hover:bg-green-200';
    if (variant === 'icon-only') return `${buttonColors.textColor} hover:opacity-70`;
    if (variant === 'icon-danger') return 'text-red-600 hover:opacity-70';
    if (variant === 'icon-success') return 'text-green-600 hover:opacity-70';
    return buttonColors.buttonPrimary;
  };
  
  const shouldUseFill = variant === 'icon-only' || variant === 'icon-danger';
  
  // get icon styling properties based on variant
  const getIconProps = () => {
    const props = {
      size: 18,
      className: label ? "mr-2" : ""
    };
    
    if (shouldUseFill) {
      props.strokeWidth = 1.5;
      props.fill = "currentColor";
      
      if (variant === 'icon-danger') {
        props.className += ' fill-red-600';
      } else if (variant === 'icon-only') {
        props.className += ' fill-current';
      }
    }
    
    return props;
  };
  
  const iconProps = getIconProps();
  
  return (
    <button
      className={`flex items-center justify-center py-2 px-4 rounded-lg ${getButtonStyles()} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {Icon && <Icon {...iconProps} />}
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
