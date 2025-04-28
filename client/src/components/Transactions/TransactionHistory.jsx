import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Receipt from '../Receipt';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import CommonUI from '../UI/CommonUI';
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
    handlePrintReceipt
  } = useTransactions();

  // column definitions
  const columns = [
    { field: 'sales_number', label: 'No. Transaksi' },
    { field: 'transaction_date', label: 'Tanggal' },
    { field: 'customer_name', label: 'Pelanggan' },
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
      <div className={`w-full min-h-screen ${colors.appBg} ${colors.transition}`}>
        <div className="max-w-7xl mx-auto px-4 py-2">
          <button
            onClick={resetToTransactionList}
            className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-lg ${colors.buttonSecondary} ${colors.transition}`}
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
  }

  // transaction list 
  return (
    <div className={`w-full min-h-screen ${colors.appBg} ${colors.transition}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`rounded-lg ${colors.cardBg} ${colors.shadow} p-4 mb-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className={`text-xl font-semibold ${colors.textColor} mb-4 md:mb-0`}>
              Transaction History
            </h2>
            
            <TransactionFilters 
              colors={colors}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </div>
          
          <TransactionTable 
            sortedTransactions={sortedTransactions}
            filteredTransactions={filteredTransactions}
            totalTransactions={transactions.length}
            columns={columns}
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
            expandedRows={expandedRows}
            toggleRowExpansion={toggleRowExpansion}
            loadingDetails={loadingDetails}
            viewReceipt={viewReceipt}
            colors={colors}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
