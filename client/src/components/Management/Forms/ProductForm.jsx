import React, { useState, useEffect } from 'react';
import { X, Check, RefreshCw } from 'lucide-react';
import FormInput from '../../UI/FormInput';
import ActionButton from '../../UI/ActionButton';
import CommonUI from '../../UI/CommonUI';

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
  const [formattedPrice, setFormattedPrice] = useState('');

  // if editing, populate form with initial data
  useEffect(() => {
    const currentId = formData?.id;
    const newId = initialData?.id;
    
    if (currentId !== newId) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          name: initialData.name || '',
          unit_price: initialData.unit_price?.toString() || '',
          code: initialData.code || ''
        });
        
        // format the initial price value
        if (initialData.unit_price !== undefined) {
          // convert to number first to a clean number without formatting
          const numericPrice = Number(initialData.unit_price);
          setFormattedPrice(formatNumberWithSeparator(numericPrice.toString()));
        }
      }
    }
  }, [initialData?.id]);

  // format number with thousand separators
  const formatNumberWithSeparator = (value) => {
    // remove any non-digit characters
    const numericValue = value.replace(/\D/g, '');
    // format with thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // handle price input change
  const handlePriceChange = (e) => {
    const rawValue = e.target.value;
    // remove any non-digit characters
    const numericValue = rawValue.replace(/\D/g, '');
    
    // update the actual form data with the numeric value
    setFormData(prev => ({ ...prev, unit_price: numericValue }));
    
    // format the displayed value with separators
    setFormattedPrice(formatNumberWithSeparator(numericValue));
    
    // clear error for this field when user starts typing
    if (formErrors.unit_price) {
      setFormErrors(prev => ({ ...prev, unit_price: null }));
    }
  };

  // regular form input change handler
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
      errors.name = 'Product Name is required';
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
    
    const isValid = validateForm();
    
    if (!isValid) {
      return false;
    }
    
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
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <FormInput
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            colors={colors}
            error={formErrors.name}
            required={false}
          />
          
          <FormInput
            label="Product Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="Enter product code"
            colors={colors}
            error={formErrors.code}
            required={false}
          />
          
          <div className="form-group">
            <label className={`block mb-2 ${colors.textColor}`}>
              Price <span className={colors.error}>*</span>
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none ${colors.textColor} border-r ${colors.border}`}>
                <span>Rp</span>
              </div>
              <input
                type="text"
                name="unit_price"
                value={formattedPrice}
                onChange={handlePriceChange}
                placeholder="e.g. 100.000"
                className={`${colors.inputBg} ${colors.textColor} pl-14 px-4 py-2 rounded-lg border ${formErrors.unit_price ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
                required={false}
              />
            </div>
            {formErrors.unit_price && (
              <CommonUI.ErrorMessage message={formErrors.unit_price} />
            )}
          </div>
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
