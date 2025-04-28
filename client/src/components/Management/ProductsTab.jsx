import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  Barcode 
} from 'lucide-react';
import * as apiService from '../../services/apiService';
import { formatCurrency } from '../../utils/formatters';
import CommonUI from '../UI/CommonUI';
import ProductForm from './Forms/ProductForm';
import ProductList from './Products/ProductList';
import SearchInput from '../UI/SearchInput';
import ActionButton from '../UI/ActionButton';

const ProductsTab = ({ products, colors, reloadProducts }) => {
  // state for managing products
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // clear operation status after timeout
  const clearOperationStatus = () => {
    setTimeout(() => setOperationStatus(null), 3000);
  };

  // handle showing add form
  const handleShowAddForm = () => {
    setEditingProduct(null);
    setShowAddForm(true);
  };

  // handle starting edit mode
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  // handle form submission for adding
  const handleAddProduct = async (productData) => {
    try {
      setIsSubmitting(true);
      await apiService.createProduct(productData);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Product added successfully' });
      
      // reload products and reset form
      await reloadProducts();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to add product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle form submission for editing
  const handleUpdateProduct = async (id, productData) => {
    try {
      setIsSubmitting(true);
      await apiService.updateProduct(id, productData);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Product updated successfully' });
      
      // reload products and reset form
      await reloadProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to update product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteProduct(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Product deleted successfully' });
      
      // reload products
      await reloadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to delete product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  return (
    <div>
      {/* header with actions */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold ${colors.textColor}`}>
              <Package className="inline-block mr-2" />
              Products Inventory
            </h2>
            <p className={`${colors.textMuted} mt-1`}>
              manage your product catalog and pricing
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search products..."
              colors={colors}
            />
            
            <ActionButton
              onClick={handleShowAddForm}
              icon={PlusCircle}
              label="Add Product"
              colors={colors}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      
      {/* operation status message */}
      <CommonUI.StatusMessage message={operationStatus} />
      
      {/* add form */}
      {showAddForm && (
        <ProductForm
          colors={colors}
          onSubmit={handleAddProduct}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle="Add New Product"
        />
      )}
      
      {/* edit form */}
      {editingProduct && (
        <ProductForm
          colors={colors}
          onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
          onCancel={handleCancelForm}
          isSubmitting={isSubmitting}
          formTitle="Edit Product"
          initialData={editingProduct}
        />
      )}
      
      {/* products list */}
      <ProductList
        products={filteredProducts}
        totalCount={products.length}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
        isLoading={isSubmitting}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onAddProduct={handleShowAddForm}
      />
    </div>
  );
};

export default ProductsTab;
