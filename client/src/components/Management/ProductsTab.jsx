import React from 'react';
import { Package, PlusCircle } from 'lucide-react';
import * as apiService from '../../services/apiService';
import ProductForm from './Forms/ProductForm';
import ProductAdapter from './Products/ProductAdapter';
import ListManager from './common/ListManager';

const ProductsTab = ({ products: initialProducts, colors }) => {
  // api methods for product management
  const productApiMethods = {
    fetchItems: apiService.getProducts,
    createItem: apiService.createProduct,
    updateItem: apiService.updateProduct,
    deleteItem: apiService.deleteProduct,
    restoreItem: apiService.restoreProduct
  };
  
  // configuration for product list
  const productConfig = {
    itemType: 'product',
    searchFields: ['name', 'code'],
    headerTitle: 'Products Inventory',
    headerDescription: 'manage your product catalog',
    itemLabel: { 
      singular: 'product', 
      plural: 'products' 
    },
    searchPlaceholder: 'search products...',
    addButtonLabel: 'Add Product'
  };

  return (
    <ListManager
      initialItems={initialProducts}
      colors={colors}
      ItemForm={ProductForm}
      ItemList={ProductAdapter}
      headerIcon={Package}
      addButtonIcon={PlusCircle}
      {...productConfig}
      {...productApiMethods}
    />
  );
};

export default ProductsTab;
