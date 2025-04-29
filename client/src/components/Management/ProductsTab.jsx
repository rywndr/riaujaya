import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  Barcode,
  Archive,
  ArchiveRestore 
} from 'lucide-react';
import * as apiService from '../../services/apiService';
import { formatCurrency } from '../../utils/formatters';
import CommonUI from '../UI/CommonUI';
import ProductForm from './Forms/ProductForm';
import ProductList from './Products/ProductList';
import SearchInput from '../UI/SearchInput';
import ActionButton from '../UI/ActionButton';
import Pagination from '../UI/Pagination';

const ProductsTab = ({ products: initialProducts, colors, reloadProducts }) => {
  // state for managing products
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [operationStatus, setOperationStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [allProducts, setAllProducts] = useState(initialProducts || []);
  
  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Initialize with products from props
  useEffect(() => {
    if (initialProducts && !showArchived) {
      setAllProducts(initialProducts);
    }
  }, [initialProducts]);

  // Fetch all products including archived ones when needed
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsSubmitting(true);
        const data = await apiService.getProducts(showArchived);
        setAllProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setOperationStatus({ type: 'error', text: 'Failed to load products' });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // Only fetch if showArchived is true (we want to see archived products)
    // or if it was true and now we're toggling back to false
    if (showArchived || allProducts.some(p => p.deleted_at)) {
      fetchProducts();
    }
  }, [showArchived]);

  // filter products based on search term
  const filteredProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // calculate pagination values
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  
  // ensure current page is valid after filtering
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  // get current page products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
      const data = await apiService.getProducts(showArchived);
      setAllProducts(data);
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
      const data = await apiService.getProducts(showArchived);
      setAllProducts(data);
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to update product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  // handle soft delete product (archive)
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to archive this product?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteProduct(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Product archived successfully' });
      
      // reload products
      const data = await apiService.getProducts(showArchived);
      setAllProducts(data);
    } catch (err) {
      console.error('Error archiving product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to archive product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };
  
  // handle restore product
  const handleRestoreProduct = async (id) => {
    try {
      setIsSubmitting(true);
      await apiService.restoreProduct(id);
      
      // show success message
      setOperationStatus({ type: 'success', text: 'Product restored successfully' });
      
      // reload products
      const data = await apiService.getProducts(showArchived);
      setAllProducts(data);
    } catch (err) {
      console.error('Error restoring product:', err);
      setOperationStatus({ type: 'error', text: 'Failed to restore product' });
    } finally {
      setIsSubmitting(false);
      clearOperationStatus();
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  // Toggle showing archived products
  const toggleShowArchived = () => {
    setShowArchived(prev => !prev);
    setCurrentPage(1); // Reset to first page when toggling archived view
  };

  return (
    <div>
      {/* header with actions */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className={`text-2xl font-bold ${colors.textColor}`}>
                <Package className="inline-block mr-2" />
                Products Inventory
              </h2>
              <p className={`${colors.textMuted} mt-1`}>
                manage your product catalog and pricing
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search products..."
                colors={colors}
                className="flex-1 sm:max-w-xs"
              />
              
              <div className="flex flex-row gap-2">
                <ActionButton
                  onClick={handleShowAddForm}
                  icon={PlusCircle}
                  label="Add Product"
                  colors={colors}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                />
                
                <ActionButton
                  onClick={toggleShowArchived}
                  icon={showArchived ? ArchiveRestore : Archive}
                  label={showArchived ? "Hide Archived" : "Show Archived"}
                  variant="outline"
                  colors={colors}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none"
                />
              </div>
            </div>
          </div>
          
          {/* archived status */}
          {showArchived && (
            <div className={`p-2 rounded ${colors.cardBg} border border-amber-400 text-center text-sm ${colors.textMuted}`}>
              <Archive className="inline-block h-4 w-4 mr-1" />
              Showing active and archived products. Some actions are limited for archived items.
            </div>
          )}
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
        products={currentProducts}
        totalCount={totalProducts}
        colors={colors}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
        onRestore={handleRestoreProduct}
        isLoading={isSubmitting}
        searchTerm={searchTerm}
        onClearSearch={() => setSearchTerm('')}
        onAddProduct={handleShowAddForm}
      />

      {/* pagination controls */}
      {totalProducts > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={totalProducts}
          colors={colors}
          itemLabel="Products"
        />
      )}
    </div>
  );
};

export default ProductsTab;
