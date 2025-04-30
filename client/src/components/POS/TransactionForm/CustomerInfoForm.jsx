import React, { useState, useEffect } from 'react';

// customer details input fields
const CustomerInfoForm = ({
  cashiers,
  selectedCashierId,
  setSelectedCashierId,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  colors
}) => {
  // input classes for form elements
  const inputClasses = `border ${colors.inputBorder} rounded-lg p-3 w-full ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200`;
  
  const [phoneError, setPhoneError] = useState('');
  const [touched, setTouched] = useState(false);

  const isValidIndonesianPhone = (phone) => {
    return /^8[0-9]{8,11}$/.test(phone);
  };
  
  // handle phone number
  const handlePhoneChange = (e) => {
    setTouched(true);
    let value = e.target.value;
    
    // remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // remove 62 prefix if user entered it manually
    const phoneNumber = digitsOnly.startsWith('62') ? digitsOnly.substring(2) : digitsOnly;
    
    // only allow digits
    if (/^[0-9]*$/.test(phoneNumber)) {
      setCustomerPhone(phoneNumber);
      
      // validate phone number format
      if (phoneNumber.length > 0) {
        if (!phoneNumber.startsWith('8')) {
          setPhoneError('Indonesian phone numbers should start with 8');
        } else if (phoneNumber.length < 9) {
          setPhoneError('Phone number is too short');
        } else if (phoneNumber.length > 12) {
          setPhoneError('Phone number is too long');
        } else {
          setPhoneError('');
        }
      } else {
        setPhoneError('');
      }
    }
  };
  
  const getFullPhoneNumber = () => {
    return customerPhone ? `+62${customerPhone}` : '';
  };

  useEffect(() => {
    if (window.getCustomerFullPhone === undefined) {
      window.getCustomerFullPhone = getFullPhoneNumber;
    }
    
    return () => {
      delete window.getCustomerFullPhone;
    };
  }, [customerPhone]);
  
  const handleBlur = () => {
    setTouched(true);
    // validate on
    if (customerPhone && !isValidIndonesianPhone(customerPhone)) {
      if (!customerPhone.startsWith('8')) {
        setPhoneError('Indonesian phone numbers should start with 8');
      } else if (customerPhone.length < 9) {
        setPhoneError('Phone number is too short');
      } else if (customerPhone.length > 12) {
        setPhoneError('Phone number is too long');
      } else {
        setPhoneError('Invalid phone number format');
      }
    }
  };
  
  return (
    <div className="space-y-5">
      <FormField label="Sales Representative:">
        <select
          value={selectedCashierId}
          onChange={(e) => setSelectedCashierId(e.target.value)}
          className={inputClasses}
        >
          <option value="">-- Select active sales --</option>
          {cashiers.map(cashier => (
            <option key={cashier.id} value={cashier.id}>
              {cashier.name}
            </option>
          ))}
        </select>
      </FormField>
      
      <FormField label="Customer Name:">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className={inputClasses}
          placeholder="Workshop customer"
        />
      </FormField>
      
      <FormField label="Phone Number:">
        <div className="flex">
          <div className={`flex items-center justify-center ${colors.inputBg} border ${colors.inputBorder} rounded-l-lg px-3 font-medium text-sm ${colors.textColor}`}>
            +62
          </div>
          <input
            type="text"
            value={customerPhone}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            className={`${inputClasses} rounded-l-none ${phoneError && touched ? 'border-red-500' : ''}`}
            placeholder="8xxxxxxxxxx"
          />
        </div>
        {phoneError && touched ? (
          <p className="text-xs mt-1 text-red-500">{phoneError}</p>
        ) : (
          <p className="text-xs mt-1 text-gray-500">Enter without country code (e.g., 812345678)</p>
        )}
      </FormField>
      
      <FormField label="Additional Notes:">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`${inputClasses} h-32 resize-none`}
          placeholder="Add notes (optional)"
        ></textarea>
      </FormField>
    </div>
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block mb-2 font-medium text-sm">{label}</label>
    {children}
  </div>
);

export default CustomerInfoForm;
