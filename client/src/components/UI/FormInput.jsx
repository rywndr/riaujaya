import React from 'react';
import CommonUI from './CommonUI';

const FormInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  colors, 
  error, 
  required = false 
}) => {
  return (
    <div>
      <label className={`block mb-2 ${colors.textColor}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${
          error ? 'border-red-500' : colors.inputBorder
        } w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
        placeholder={placeholder}
      />
      {error && <CommonUI.ErrorMessage message={error} />}
    </div>
  );
};

export default FormInput;
