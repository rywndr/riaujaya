import React from 'react';

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
        <input
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className={inputClasses}
          placeholder="Customer phone number"
        />
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
