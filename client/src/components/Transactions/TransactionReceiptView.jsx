import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Receipt from '../POS/Receipt/MainReceipt';

const TransactionReceiptView = ({
  selectedTransaction,
  receiptCart,
  resetToTransactionList,
  receiptRef,
  handlePrintReceipt,
  colors,
  utils
}) => {
  return (
    <div className={`w-full min-h-screen ${colors.appBg} ${colors.transition}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button
          onClick={resetToTransactionList}
          className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg ${colors.buttonSecondary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        >
          <ArrowLeft size={16} />
          <span>Back to Transaction History</span>
        </button>
        
        <Receipt 
          receiptRef={receiptRef}
          currentTransaction={selectedTransaction}
          cart={receiptCart}
          utils={utils}
          printReceipt={handlePrintReceipt}
          resetTransaction={resetToTransactionList}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default TransactionReceiptView;