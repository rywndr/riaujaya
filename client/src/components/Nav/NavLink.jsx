import React from 'react';
import { Link } from 'react-router-dom';

const NavLink = ({ to, icon: Icon, label, isActive, onClick, colors, isMobile }) => {
  const baseStyles = isActive
    ? 'bg-blue-600 text-white'
    : `${colors.textColor} hover:bg-blue-100 hover:text-blue-700`;

  const sizeStyles = isMobile
    ? 'px-3 py-2 text-base w-full'
    : 'px-4 py-2 text-sm';

  return (
    <Link
      to={to}
      className={`flex items-center rounded-md font-medium transition-colors duration-200 ${baseStyles} ${sizeStyles}`}
      onClick={onClick}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {label}
    </Link>
  );
};

export default NavLink
