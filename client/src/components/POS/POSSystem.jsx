import React, { useState, useRef, useEffect } from 'react';
import CommonUI from '../UI/CommonUI';
import TransactionForm from './TransactionForm/MainTransactionForm';
import Receipt from './Receipt/MainReceipt';
import { useOutletContext } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTransactionState } from '../../hooks/useTransactionState';
import { useFetchData } from '../../hooks/useFetchData';
import { printReceipt, prepareReceiptData } from '../../utils/receiptUtils';
import * as apiService from '../../services/apiService';
import * as formatters from '../../utils/formatters';
import * as calculations from '../../utils/calculations';

const POSSystem = () => {
  // get shared colors from layout context
  const { colors } = useOutletContext();

  // combine utils into a single object for ease of use
  const utils = {
    ...formatters,
    ...calculations
  };

  // custom hooks
  const { 
    products, 
    cashiers, 
    isLoading, 
    error 
  } = useFetchData();
  
  const {
    selectedCashierId,
    setSelectedCashierId,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    notes,
    setNotes,
    salesNumber,
    setSalesNumber,
    printedInfo,
    setPrintedInfo,
    showReceipt,
    setShowReceipt,
    currentTransaction,
    setCurrentTransaction,
    resetTransactionState
  } = useTransactionState();

  const {
    cart,
    cartFunctions,
    subtotal,
    totalDiscount,
    total
  } = useCart();

  // ref to the receipt element for printing
  const receiptRef = useRef(null);
  
  // get cashier name by ID
  const getCashierName = (cashierId) => {
    if (!cashierId) return '';
    const cashier = cashiers.find(c => c.id === parseInt(cashierId));
    return cashier ? cashier.name : '';
  };
  
  // transaction functions
  const processTransaction = async () => {
    
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }
    
    if (!selectedCashierId) {
      alert('Pilih nama kasir');
      return;
    }
    
    // use customer name or default
    const finalCustomerName = customerName.trim() || "KONSUMEN BENGKEL";
    
    // generate sales number
    const newSalesNumber = utils.generateSalesNumber();
    setSalesNumber(newSalesNumber);
    
    // generate printed info
    const printedByInfo = `${getCashierName(selectedCashierId)}, ${utils.formatPrintedDate()}`;
    setPrintedInfo(printedByInfo);
    
    try {
      // create transaction payload for api
      const transactionData = {
        sales_number: newSalesNumber,
        cashier_id: parseInt(selectedCashierId),
        customer_name: finalCustomerName,
        customer_phone: customerPhone,
        subtotal,
        discount: totalDiscount,
        total,
        notes: notes,
        printed_by: printedByInfo,
        cart: cart.map(item => ({
          ...item,
        })),
      };
      
      // send transaction to api
      const result = await apiService.createTransaction(transactionData);
      
      // create transaction object for receipt using api response and our utility
      const transaction = {
        id: result.transaction.id,
        sales_number: newSalesNumber,
        transaction_date: result.transaction.created_at || new Date().toISOString(),
        customer_name: finalCustomerName,
        customer_phone: customerPhone,
        cashier_name: getCashierName(selectedCashierId),
        subtotal,
        discount: totalDiscount,
        total_amount: total,
        notes: notes,
        printed_by: printedByInfo
      };
      
      // use prepareReceiptData utility to format transaction data
      const { receiptTransaction } = prepareReceiptData(transaction, cart);
      
      // clear cart immediately after successful transaction
      cartFunctions.clearCart();
      
      // set current transaction for receipt
      setCurrentTransaction(receiptTransaction);
      setShowReceipt(true);
    } catch (error) {
      alert(`transaction error: ${error.message}`);
      console.error('transaction error:', error);
    }
  };

  // reset transaction
  const resetTransaction = () => {
    cartFunctions.clearCart();
    resetTransactionState();
  };
  
  // render loading state
  if (isLoading) {
    return <CommonUI.LoadingView colors={colors} />;
  }
  
  // render error state
  if (error) {
    return <CommonUI.ErrorView colors={colors} error={error} />;
  }
  
  return (
    <div className={`w-full ${colors.pageBg}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        {showReceipt ? (
          <Receipt 
            receiptRef={receiptRef}
            currentTransaction={currentTransaction}
            cart={cart}
            utils={utils}
            printReceipt={() => printReceipt(receiptRef)}
            resetTransaction={resetTransaction}
            colors={colors}
          />
        ) : (
          <TransactionForm
            products={products}
            cashiers={cashiers}
            colors={colors}
            utils={utils}
            cartFunctions={cartFunctions}
            cart={cart}
            selectedCashierId={selectedCashierId}
            setSelectedCashierId={setSelectedCashierId}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            notes={notes}
            setNotes={setNotes}
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            total={total}
            processTransaction={processTransaction}
            resetTransaction={resetTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default POSSystem;