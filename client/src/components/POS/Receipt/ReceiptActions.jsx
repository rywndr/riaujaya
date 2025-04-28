import React from 'react';

const ReceiptActions = ({ printReceipt, resetTransaction, colors }) => {
  return (
    <div className="flex justify-center space-x-4 w-full md:w-3/4">
      <ActionButton 
        onClick={resetTransaction}
        className={colors.buttonSecondary}
        label="Transaksi Baru"
      />
      
      <ActionButton 
        onClick={printReceipt}
        className={colors.buttonPrimary}
        label="Cetak Struk"
      />
    </div>
  );
};

const ActionButton = ({ onClick, className, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-3 rounded-lg ${className} font-medium transition-colors duration-200`}
  >
    {label}
  </button>
);

export default ReceiptActions;
