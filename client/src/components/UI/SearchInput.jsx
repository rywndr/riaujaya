import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder, colors }) => {
  return (
    <div className="relative flex-grow md:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className={colors.textMuted} />
      </div>
      <input
        type="text"
        placeholder={placeholder || "search..."}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
      />
    </div>
  );
};

export default SearchInput;
