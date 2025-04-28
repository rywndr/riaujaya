import { useState } from 'react';

export const useTransactionState = () => {
  // transaction state
  const [selectedCashierId, setSelectedCashierId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [salesNumber, setSalesNumber] = useState('');
  const [printedInfo, setPrintedInfo] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  // reset transaction state
  const resetTransactionState = () => {
    setSelectedCashierId('');
    setCustomerName('');
    setCustomerPhone('');
    setShowReceipt(false);
    setCurrentTransaction(null);
    setNotes('');
    setSalesNumber('');
    setPrintedInfo('');
  };
  
  return {
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
  };
};
