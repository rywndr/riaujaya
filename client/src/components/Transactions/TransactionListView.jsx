import React from 'react';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import Pagination from '../UI/Pagination';

const TransactionListView = ({
  transactions,
  sortedTransactions,
  filteredTransactions,
  columns,
  sortField,
  sortDirection,
  handleSort,
  expandedRows,
  toggleRowExpansion,
  loadingDetails,
  viewReceipt,
  deleteTransaction,
  isDeleting,
  colors,
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  deleteError,
  currentPage,
  itemsPerPage,
  totalPages,
  handlePageChange,
  handleItemsPerPageChange
}) => {
  return (
    <div className={`w-full min-h-screen ${colors.appBg} ${colors.transition}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`rounded-lg ${colors.cardBg} ${colors.shadow} p-6 mb-6`}>
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
          
          {deleteError && (
            <div className={`mb-4 p-4 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-2`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {deleteError}
            </div>
          )}
          
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
            deleteTransaction={deleteTransaction}
            isDeleting={isDeleting}
            colors={colors}
          />
          
          {filteredTransactions.length > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={handleItemsPerPageChange}
              totalItems={filteredTransactions.length}
              colors={colors}
              itemLabel="Transactions"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionListView;