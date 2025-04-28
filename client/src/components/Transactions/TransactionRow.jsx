import React from 'react';
import { Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

const TransactionRow = ({ 
  transaction, 
  isExpanded,
  toggleRowExpansion, 
  colors
}) => {
  return (
    <tr className={`${colors.tableHover} ${colors.transition}`}>
      <td className="px-4 py-3">{transaction.sales_number}</td>
      <td className="px-4 py-3">{formatDate(transaction.transaction_date)}</td>
      <td className="px-4 py-3">{transaction.customer_name}</td>
      <td className="px-4 py-3">{transaction.cashier_name}</td>
      <td className="px-4 py-3">{formatCurrency(transaction.total_amount)}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => toggleRowExpansion(transaction.id)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonSecondary} text-sm ${colors.transition}`}
        >
          <Eye size={14} />
          <span>{isExpanded ? 'Close' : 'Detail'}</span>
        </button>
      </td>
    </tr>
  );
};

export default TransactionRow;
