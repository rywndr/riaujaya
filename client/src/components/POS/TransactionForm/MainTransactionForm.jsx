import React from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import ProductSearch from './ProductSearch';
import ShoppingCartComponent from './ShoppingCartComponent';

const TransactionForm = ({
  products,
  cashiers,
  colors,
  utils,
  cartFunctions,
  cart,
  selectedCashierId,
  setSelectedCashierId,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  subtotal,
  totalDiscount,
  total,
  processTransaction,
  resetTransaction
}) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* transaction details section */}
      <div className={`col-span-4 ${colors.cardBg} rounded-xl shadow-lg p-6 h-fit sticky top-4 ${colors.textColor}`}>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          Transaction Details
        </h2>
        
        <CustomerInfoForm 
          cashiers={cashiers}
          selectedCashierId={selectedCashierId}
          setSelectedCashierId={setSelectedCashierId}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          notes={notes}
          setNotes={setNotes}
          colors={colors}
        />

        {/* process and reset buttons */}
        <ActionButtons 
          resetTransaction={resetTransaction}
          processTransaction={processTransaction}
          cartIsEmpty={cart.length === 0}
          colors={colors}
        />
      </div>
      
      {/* right side container */}
      <div className="col-span-8 space-y-6">
        {/* product search and list section */}
        <ProductSearch 
          products={products}
          colors={colors}
          utils={utils}
          cartFunctions={cartFunctions}
        />
        
        {/* cart section */}
        <ShoppingCartComponent 
          cart={cart}
          colors={colors}
          utils={utils}
          cartFunctions={cartFunctions}
          subtotal={subtotal}
          totalDiscount={totalDiscount}
          total={total}
        />
      </div>
    </div>
  );
};

// action buttons 
const ActionButtons = ({ resetTransaction, processTransaction, cartIsEmpty, colors }) => (
  <div className="grid grid-cols-2 gap-4 mt-8">
    <button
       onClick={resetTransaction}
       className={`${colors.buttonSecondary} py-2 px-1 rounded-lg font-medium text-md ${colors.textColor} transition-all duration-200 hover:opacity-90 flex items-center justify-center`}
    >
        Reset
    </button>
    <button
      onClick={processTransaction}
      className={`${colors.buttonPrimary} py-1 px-2 rounded-lg font-medium text-md transition-all duration-200 hover:opacity-90 flex items-center justify-center`}
      disabled={cartIsEmpty}
    >
      Process Transaction
    </button>
  </div>
);

export default TransactionForm;
