import React from 'react';
import ProductList from './ProductList';

// adapter to make ProductList compatible with ListManager
const ProductAdapter = ({ 
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
    <ProductList
      products={items}
      totalCount={totalCount}
      colors={colors}
      onEdit={onEdit}
      onDelete={onDelete}
      onRestore={onRestore}
      isLoading={isLoading}
      searchTerm={searchTerm}
      onClearSearch={onClearSearch}
      onAddProduct={onAddItem}
    />
  );
};

export default ProductAdapter;