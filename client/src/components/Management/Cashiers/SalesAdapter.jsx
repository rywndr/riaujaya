import React from 'react';
import SalesList from './SalesList';

// adapter to make SalesList compatible with ListManager
const SalesAdapter = ({ 
  items, 
  totalCount, 
  colors, 
  onEdit, 
  onDelete, 
  onRestore, 
  isLoading, 
  searchTerm, 
  onClearSearch, 
  onAddItem 
}) => {
  return (
    <SalesList
      cashiers={items}
      totalCount={totalCount}
      colors={colors}
      onEdit={onEdit}
      onDelete={onDelete}
      onRestore={onRestore}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onClearSearch={onClearSearch}
      onAddCashier={onAddItem}
    />
  );
};

export default SalesAdapter;