import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ReceiptHeader from './ReceiptHeader';
import ReceiptTable from './ReceiptTable';
import ReceiptSummary from './ReceiptSummary';
import ReceiptSignatures from './ReceiptSignatures';
import ReceiptActions from './ReceiptActions';

const Receipt = ({ 
  receiptRef, 
  currentTransaction, 
  cart, 
  utils, 
  printReceipt, 
  resetTransaction 
}) => {
  // return early if no transaction is available
  if (!currentTransaction) return null;
  
  // get shared color classes from context
  const { colors } = useOutletContext();
  
  return (
    <div className="flex flex-col items-center">
      <div ref={receiptRef} className={`${colors.cardBg} ${colors.textColor} border rounded-lg ${colors.shadowLg} p-8 mb-4 w-full mx-auto`}>
        <ReceiptHeader 
          currentTransaction={currentTransaction} 
        />
        
        <ReceiptTable 
          cart={cart} 
          utils={utils}
          colors={colors}
        />
        
        <ReceiptSummary 
          currentTransaction={currentTransaction} 
          utils={utils}
        />
        
        <ReceiptSignatures />
      </div>
      
      <ReceiptActions 
        printReceipt={printReceipt}
        resetTransaction={resetTransaction}
        colors={colors}
      />
    </div>
  );
};

export default Receipt;
