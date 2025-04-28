import React, { useState, useEffect } from 'react';
import { X, Check, RefreshCw } from 'lucide-react';
import FormInput from '../../UI/FormInput';
import ActionButton from '../../UI/ActionButton';

const ProductForm = ({ 
  colors, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  formTitle, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    unit_price: '', 
    code: '' 
  });
  const [formErrors, setFormErrors] = useState({});

  // if editing, populate form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        unit_price: initialData.unit_price?.toString() || '',
        code: initialData.code || ''
      });
    }
  }, [initialData]);

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
      errors.name = 'Name is required';
    }
    
    if (!formData.unit_price.trim()) {
      errors.unit_price = 'Price is required';
    } else if (isNaN(parseFloat(formData.unit_price)) || parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = 'Price must be a positive number';
    }
    
    if (!formData.code.trim()) {
      errors.code = 'Product code is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // format the unit_price as a number before sending
    const productData = {
      ...formData,
      unit_price: parseFloat(formData.unit_price)
    };
    
    onSubmit(productData);
  };

  return (
    <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-xl font-semibold ${colors.textColor}`}>{formTitle}</h3>
        <ActionButton
          onClick={onCancel}
          icon={X}
          variant="secondary"
          colors={colors}
          className="p-2 rounded-full"
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            colors={colors}
            error={formErrors.name}
            required
          />
          
          <FormInput
            label="Product Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter product code"
            colors={colors}
            error={formErrors.code}
            required
          />
          
          <FormInput
            label="Price"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleInputChange}
            placeholder="e.g. 10000"
            colors={colors}
            error={formErrors.unit_price}
            required
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <ActionButton
            onClick={onCancel}
            label="Cancel"
            variant="secondary"
            colors={colors}
            disabled={isSubmitting}
          />
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
            {initialData ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
