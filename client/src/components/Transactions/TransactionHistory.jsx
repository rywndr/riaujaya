import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../hooks/useTransactions';
import CommonUI from '../UI/CommonUI';
import TransactionListView from './TransactionListView';
import TransactionReceiptView from './TransactionReceiptView';
import * as formatters from '../../utils/formatters';
import * as calculations from '../../utils/calculations';

const TransactionHistory = () => {
  // get shared colors and dark mode from layout context
  const { user } = useAuth();
  const { colors } = useOutletContext();

  // combine utils into a single object for ease of use
  const utils = {
    ...formatters,
    ...calculations
  };

  // use the custom hook for transaction management
  const {
    sortedTransactions,
    filteredTransactions,
    transactions,
    isLoading,
    error,
    loadingDetails,
    expandedRows,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    sortField,
    sortDirection,
    handleSort,
    toggleRowExpansion,
    viewReceipt,
    selectedTransaction,
    receiptCart,
    viewingReceipt,
    resetToTransactionList,
    receiptRef,
    handlePrintReceipt,
    deleteTransaction,
    isDeleting,
    deleteError,
    // Pagination props
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange
  } = useTransactions();

  // column definitions
  const columns = [
    { field: 'sales_number', label: '#Transaction' },
    { field: 'transaction_date', label: 'Date' },
    { field: 'customer_name', label: 'Customer' },
    { field: 'cashier_name', label: 'Sales' },
    { field: 'total_amount', label: 'Total' },
  ];

  // render loading state
  if (isLoading) {
    return <CommonUI.LoadingView colors={colors} message="loading data..." />;
  }
  
  // render error state
  if (error) {
    return <CommonUI.ErrorView colors={colors} error={error} />;
  }

  // render receipt if viewing a receipt
  if (viewingReceipt && selectedTransaction) {
    return (
      <TransactionReceiptView
        selectedTransaction={selectedTransaction}
        receiptCart={receiptCart}
        resetToTransactionList={resetToTransactionList}
        receiptRef={receiptRef}
        handlePrintReceipt={handlePrintReceipt}
        colors={colors}
        utils={utils}
      />
    );
  }

  // render the transaction list view 
  return (
    <TransactionListView
      transactions={transactions}
      sortedTransactions={sortedTransactions}
      filteredTransactions={filteredTransactions}
      columns={columns}
      sortField={sortField}
      sortDirection={sortDirection}
      handleSort={handleSort}
      expandedRows={expandedRows}
      toggleRowExpansion={toggleRowExpansion}
      loadingDetails={loadingDetails}
      viewReceipt={viewReceipt}
      deleteTransaction={deleteTransaction}
      isDeleting={isDeleting}
      colors={colors}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      deleteError={deleteError}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      handleItemsPerPageChange={handleItemsPerPageChange}
    />
  );
};

export default TransactionHistory;
