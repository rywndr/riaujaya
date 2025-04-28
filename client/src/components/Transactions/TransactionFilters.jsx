import React from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

const TransactionFilters = ({ 
  colors,
  searchTerm, 
  setSearchTerm, 
  selectedFilter, 
  setSelectedFilter 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
      <div className="relative flex-grow md:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className={colors.textMuted} />
        </div>
        <input
          type="text"
          placeholder="search transaction, customer, or sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
        />
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar size={16} className={colors.textMuted} />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className={`appearance-none w-full pl-10 pr-8 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={16} className={colors.textMuted} />
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
