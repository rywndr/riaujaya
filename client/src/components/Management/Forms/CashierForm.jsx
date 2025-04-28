import React, { useState, useEffect } from 'react';
import ActionButton from '../../UI/ActionButton';
import { 
  X, 
  Check, 
  RefreshCw
} from 'lucide-react';

const CashierForm = ({ 
  colors, 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  formTitle, 
  initialData = { name: '' } 
}) => {
  // state for form data and validation
  const [formData, setFormData] = useState(initialData);
  const [formErrors, setFormErrors] = useState({});
  
  // update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [JSON.stringify(initialData)]); 
  
  // form input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // clear error  when user starts typing
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };
  
  return (
    <div className={`${colors.cardBg} rounded-lg ${colors.shadow} p-6 mb-6`}>
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
        <div className="mb-4">
          <label className={`block mb-2 ${colors.textColor}`}>
            Cashier name <span className={colors.error}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${colors.inputBg} ${colors.textColor} px-4 py-2 rounded-lg border ${formErrors.name ? 'border-red-500' : colors.inputBorder} w-full focus:outline-none focus:ring-2 ${colors.inputFocus}`}
            placeholder="Enter cashier name"
          />
          {formErrors.name && (
            <p className={`${colors.error} text-sm mt-1`}>{formErrors.name}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className={`${colors.buttonOutline} px-4 py-2 rounded-lg ${colors.transition}`}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            cancel
          </button>
          <button
            type="submit"
            className={`${colors.buttonPrimary} px-4 py-2 rounded-lg flex items-center ${colors.transition}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <RefreshCw className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Check className="h-5 w-5 mr-2" />
            )}
            {initialData.id ? 'Update cashier' : 'Save cashier'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CashierForm;
