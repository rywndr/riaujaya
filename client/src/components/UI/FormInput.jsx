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
  required = false,
  showRequired = false,
  prefix = null
}) => {
  return (
    <div>
      <label className={`block mb-2 ${colors.textColor}`}>
        {label} {showRequired && <span className="text-red-500">*</span>}
      </label>
      <div className={prefix ? "relative" : ""}>
        {prefix && (
          <div className={`absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none ${colors.textColor} border-r ${colors.border}`}>
            <span>{prefix}</span>
          </div>
        )}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`${colors.inputBg} ${colors.textColor} ${prefix ? 'pl-14' : 'px-4'} py-2 rounded-lg border ${
            error ? 'border-red-500' : colors.inputBorder
          } w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
          placeholder={placeholder}
        />
      </div>
      {error && <CommonUI.ErrorMessage message={error} />}
    </div>
  );
};

export default FormInput;
