import React from 'react';
import { Loader, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const TransactionDetails = ({ transaction, isLoading, colors, viewReceipt }) => {
  return (
    <td colSpan="6" className="px-6 py-4">
      <div className="py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className={`${colors.textMuted} text-sm`}>
              <span className="font-medium">No. telepon:</span> {transaction.customer_phone}
            </p>
            <p className={`${colors.textMuted} text-sm`}>
              <span className="font-medium">Catatan:</span> {transaction.notes || '-'}
            </p>
          </div>
          <div className="text-right">
            <p className={`${colors.textMuted} text-sm`}>
              <span className="font-medium">Subtotal:</span> {formatCurrency(transaction.subtotal)}
            </p>
            <p className={`${colors.textMuted} text-sm`}>
              <span className="font-medium">Diskon:</span> {formatCurrency(transaction.subtotal && transaction.total_amount ? 
                Math.max(0, transaction.subtotal - transaction.total_amount) : 0)}
            </p>
            <p className={`${colors.textColor} font-semibold`}>
              <span className="font-medium">Total:</span> {formatCurrency(transaction.total_amount)}
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4">
            <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
            <p className={`${colors.textMuted}`}>loading item details...</p>
          </div>
        ) : transaction.items ? (
          <>
            <div className={`mt-3 border-t border-b ${colors.border} py-3 mb-2`}>
              <h4 className="font-medium mb-3">Item Transaksi:</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm">
                      <th className="text-left py-2 font-medium">Produk</th>
                      <th className="text-right py-2 font-medium">Harga</th>
                      <th className="text-right py-2 font-medium">Qty</th>
                      <th className="text-right py-2 font-medium">Diskon</th>
                      <th className="text-right py-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {transaction.items.map((item) => (
                      <tr key={item.id} className={`border-t ${colors.border}`}>
                        <td className="py-2">{item.product_name}</td>
                        <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">{item.discount_percentage}%</td>
                        <td className="text-right py-2">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <p className={`text-xs ${colors.textMuted}`}>
                Printed by: {transaction.printed_by || '-'}
              </p>
              <button
                onClick={() => viewReceipt(transaction)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonPrimary} text-sm ${colors.transition}`}
              >
                <FileText size={14} />
                <span>View Receipt</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className={`${colors.textMuted}`}>no item details available</p>
          </div>
        )}
      </div>
    </td>
  );
};

export default TransactionDetails;
