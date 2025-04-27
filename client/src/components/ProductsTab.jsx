import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  PlusCircle, 
  Edit2, 
  Trash,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
  Barcode
} from 'lucide-react';
import * as apiService from '../services/apiService';
import { formatCurrency } from '../utils/formatters';

const ProductsTab = ({ products, colors, reloadProducts }) => {
  // state for managing products
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit_price: '', code: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationStatus, setOperationStatus] = useState(null);

  // reset form
  const resetForm = () => {
    setFormData({ name: '', unit_price: '', code: '' });
    setFormErrors({});
    setEditingProduct(null);
    setShowAddForm(false);
    setIsSubmitting(false);
  };

  // handle showing add form
  const handleShowAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  // handle starting edit mode
  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({ 
      name: product.name, 
      unit_price: product.unit_price.toString(), 
      code: product.code 
    });
    setFormErrors({});
    setShowAddForm(false);
  };

  // form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'name is required';
    }
    
    if (!formData.unit_price.trim()) {
      errors.unit_price = 'price is required';
    } else if (isNaN(parseFloat(formData.unit_price)) || parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = 'price must be a positive number';
    }
    
    if (!formData.code.trim()) {
      errors.code = 'product code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // handle form submission for adding
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      // format the unit_price as a number before sending
      const productData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price)
      };
      
      await apiService.createProduct(productData);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'product added successfully' });
      
      // reload products and reset form
      await reloadProducts();
      resetForm();
    } catch (err) {
      console.error('error adding product:', err);
      setOperationStatus({ type: 'error', message: 'failed to add product' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      // format the unit_price as a number before sending
      const productData = {
        ...formData,
        unit_price: parseFloat(formData.unit_price)
      };
      
      await apiService.updateProduct(editingProduct, productData);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'Product updated successfully' });
      
      // reload products and reset form
      await reloadProducts();
      resetForm();
    } catch (err) {
      console.error('Error updating product:', err);
      setOperationStatus({ type: 'error', message: 'Failed to update product' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // handle delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setIsSubmitting(true);
      await apiService.deleteProduct(id);
      
      // show success message
      setOperationStatus({ type: 'success', message: 'Product deleted successfully' });
      
      // reload products
      await reloadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setOperationStatus({ type: 'error', message: 'Failed to delete product' });
    } finally {
      setIsSubmitting(false);
      
      // clear status message after 3 seconds
      setTimeout(() => setOperationStatus(null), 3000);
    }
  };

  // filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="relative flex-grow md:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={colors.textMuted} />
              </div>
                <input
                  type="text"
                  placeholder="search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                />
            </div>
            
            <button
              className={`${colors.buttonPrimary} flex items-center justify-center py-2 px-4 rounded-lg`}
              onClick={handleShowAddForm}
              disabled={isSubmitting}
            >
              <PlusCircle size={18} className="mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>
      
      {/* operation status message */}
      {operationStatus && (
        <div className={`rounded-lg mb-6 p-4 flex items-center ${
          operationStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {operationStatus.type === 'success' ? (
            <Check className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span>{operationStatus.message}</span>
        </div>
      )}
      
      {/* add form */}
      {showAddForm && (
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${colors.textColor}`}>Add New Product</h3>
            <button 
              className={`${colors.buttonSecondary} p-2 rounded-full`}
              onClick={() => setShowAddForm(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleAddSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.code ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="Enter product code"
                />
                {formErrors.code && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>
                )}
              </div>
              
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.unit_price ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="e.g. 10000"
                />
                {formErrors.unit_price && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.unit_price}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`${colors.buttonSecondary} px-4 py-2 rounded-lg`}
                onClick={() => setShowAddForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* edit form */}
      {editingProduct && (
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-semibold ${colors.textColor}`}>Edit Product</h3>
            <button 
              className={`${colors.buttonSecondary} p-2 rounded-full`}
              onClick={() => setEditingProduct(null)}
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="enter product name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Product Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.code ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="enter product code"
                />
                {formErrors.code && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.code}</p>
                )}
              </div>
              
              <div>
                <label className={`block mb-2 ${colors.textColor}`}>
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.unit_price ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                  placeholder="0.00"
                />
                {formErrors.unit_price && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.unit_price}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={`${colors.buttonSecondary} px-4 py-2 rounded-lg`}
                onClick={() => setEditingProduct(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <Check className="h-5 w-5 mr-2" />
                )}
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* products list */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${colors.divider}`}>
            <thead className={`${colors.tableHeaderBg} ${colors.tableText}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${colors.divider} ${colors.textColor}`}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className={`${colors.tableHover}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Package className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Barcode className={`h-5 w-5 mr-2 ${colors.textMuted}`} />
                        <span>{product.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{formatCurrency(product.unit_price)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        className={`${colors.buttonOutline} p-2 rounded-lg inline-flex items-center justify-center`}
                        onClick={() => handleEdit(product)}
                        disabled={isSubmitting}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-lg inline-flex items-center justify-center"
                        onClick={() => handleDelete(product.id)}
                        disabled={isSubmitting}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    {searchTerm ? (
                      <div>
                        <Search className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                        <p>No products found matching "{searchTerm}"</p>
                        <button 
                          className={`${colors.buttonOutline} mt-2 px-4 py-1 rounded-lg text-sm`}
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Package className={`h-8 w-8 mx-auto ${colors.textMuted} mb-2`} />
                        <p>No products found</p>
                        <button 
                          className={`${colors.buttonPrimary} mt-2 px-4 py-1 rounded-lg text-sm`}
                          onClick={handleShowAddForm}
                        >
                          add your first product
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className={`px-6 py-4 border-t ${colors.divider}`}>
          <p className={`text-sm ${colors.textMuted}`}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
