import React, { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const TransactionRow = ({ 
  transaction, 
  isExpanded,
  toggleRowExpansion, 
  onDelete,
  isDeleting,
  colors
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    await onDelete(transaction.id);
    setShowDeleteConfirm(false);
  };
  
  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };
  
  return (
    <tr className={`${colors.tableHover} ${colors.transition}`}>
      <td className="px-4 py-3">{transaction.sales_number}</td>
      <td className="px-4 py-3">{formatDate(transaction.transaction_date)}</td>
      <td className="px-4 py-3">{transaction.customer_name}</td>
      <td className="px-4 py-3">{transaction.cashier_name}</td>
      <td className="px-4 py-3">{formatCurrency(transaction.total_amount)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleRowExpansion(transaction.id)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonSecondary} text-sm ${colors.transition}`}
          >
            <Eye size={14} />
            <span>{isExpanded ? 'Close' : 'Detail'}</span>
          </button>
          
          {showDeleteConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting[transaction.id]}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm ${colors.transition}`}
              >
                {isDeleting[transaction.id] ? 'Deleting...' : 'Confirm'}
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting[transaction.id]}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonSecondary} text-sm ${colors.transition}`}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.cardBg} border ${colors.border} text-sm ${colors.error} hover:bg-red-50 dark:hover:bg-red-900/30 ${colors.transition}`}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TransactionRow;
