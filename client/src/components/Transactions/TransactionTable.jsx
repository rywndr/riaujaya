import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import TransactionRow from './TransactionRow';
import TransactionDetails from './TransactionDetails';

const TransactionTable = ({ 
  sortedTransactions,
  filteredTransactions,
  totalTransactions,
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
  colors
}) => {
  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className={`min-w-full divide-y ${colors.divider}`}>
          <thead className={`${colors.tableHeaderBg}`}>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.field}
                  onClick={() => handleSort(column.field)}
                  className={`px-4 py-3 text-left cursor-pointer ${colors.tableText} text-sm font-medium`}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {sortField === column.field ? (
                      sortDirection === 'asc' ? 
                        <ArrowUp size={14} className="text-blue-500" /> : 
                        <ArrowDown size={14} className="text-blue-500" />
                    ) : (
                      <ArrowUpDown size={14} className="text-gray-400" /> 
                    )}
                  </div>
                </th>
              ))}
              <th className={`px-4 py-3 text-left ${colors.tableText} text-sm font-medium`}>
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className={`${colors.textColor} divide-y ${colors.divider}`}>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TransactionRow 
                    transaction={transaction}
                    isExpanded={expandedRows[transaction.id]}
                    toggleRowExpansion={toggleRowExpansion}
                    onDelete={deleteTransaction}
                    isDeleting={isDeleting}
                    colors={colors}
                  />
                  {expandedRows[transaction.id] && (
                    <tr className={`${colors.tableBg}`}>
                      <TransactionDetails 
                        transaction={transaction}
                        isLoading={loadingDetails[transaction.id]}
                        colors={colors}
                        viewReceipt={viewReceipt}
                      />
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center">
                  <p className={`${colors.textMuted}`}>
                    {totalTransactions > 0 
                      ? 'No transactions found'
                      : 'No transactions available'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TransactionTable;
