import { useState } from 'react';

export const useFormValidation = (validationRules) => {
  const [formErrors, setFormErrors] = useState({});
  
  // validate form fields
  const validateForm = (formData) => {
    const errors = {};
    let isValid = true;
    
    // apply validation rules to form data
    Object.keys(formData).forEach(field => {
      if (validationRules[field]) {
        const error = validationRules[field](formData[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };
  
  return { formErrors, validateForm };
};
