import React, { useState, useEffect, useRef, useMemo } from 'react';
import Receipt from './Receipt';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';
import { printReceipt, prepareReceiptData } from '../utils/receiptUtils';
import * as apiService from '../services/apiService';
import * as formatters from '../utils/formatters';
import * as calculations from '../utils/calculations';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Eye, 
  ArrowLeft,
  Loader
} from 'lucide-react';

const TransactionHistory = () => {
  // get shared colors and dark mode from layout context
  const { user } = useAuth();
  const { colors } = useOutletContext();

  // states
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortField, setSortField] = useState('transaction_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [error, setError] = useState(null);

  // receipt viewing states
  const [viewingReceipt, setViewingReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [receiptCart, setReceiptCart] = useState([]);

  // combine utils into a single object for ease of use
  const utils = {
    ...formatters,
    ...calculations
  };

  // ref to the receipt element for printing
  const receiptRef = useRef(null);

  // load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // fetch transactions data
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getTransactions();
      
      // normalize transaction data
      const formattedTransactions = data.map(transaction => ({
        ...transaction,
        transaction_date: transaction.transaction_date || new Date().toISOString(),
        customer_name: transaction.customer_name || 'konsumen bengkel',
        cashier_name: transaction.cashier_name || 'unknown',
        total_amount: transaction.total_amount || 0,
        customer_phone: transaction.customer_phone || '-',
        subtotal: transaction.subtotal,
        discount: transaction.discount || 0
      }));
      
      setTransactions(formattedTransactions);
      setError(null);
    } catch (err) {
      setError('failed to load transactions. please try again later.');
      console.error('error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch transaction details when expanding a row
  const fetchTransactionDetails = async (transactionId) => {
    // skip if already loaded
    if (transactions.find(t => t.id === transactionId)?.items) return;

    try {
      // show loading state for this specific transaction
      setLoadingDetails(prev => ({ ...prev, [transactionId]: true }));
      
      const data = await apiService.getTransactionById(transactionId);
      
      if (data?.transaction && Array.isArray(data.items)) {
        // update transaction with details
        setTransactions(prev => 
          prev.map(transaction => 
            transaction.id === transactionId 
              ? { 
                  ...transaction, 
                  items: data.items,
                  customer_phone: data.transaction.customer_phone || '-',
                  subtotal: data.transaction.subtotal || 
                            data.items.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0),
                  discount: data.transaction.discount || 0,
                  notes: data.transaction.notes || '-',
                  printed_by: data.transaction.printed_by || '-'
                }
              : transaction
          )
        );
      } else {
        console.error("unexpected response format:", data);
        setError("failed to load transaction details. please try again.");
      }
    } catch (err) {
      console.error('error fetching transaction details:', err);
      setError(`error loading details: ${err.message}`);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [transactionId]: false }));
    }
  };

  // toggle expanded row
  const toggleRowExpansion = async (id) => {
    const newExpandedState = !expandedRows[id];
    setExpandedRows(prev => ({
      ...prev,
      [id]: newExpandedState
    }));
    
    // fetch details when expanding
    if (newExpandedState) {
      await fetchTransactionDetails(id);
    }
  };

  // view receipt function
  const viewReceipt = async (transaction) => {
    // ensure we have transaction details
    if (!transaction.items) {
      await fetchTransactionDetails(transaction.id);
      // get updated transaction with items from state
      transaction = transactions.find(t => t.id === transaction.id);
    }

    // use shared utility to prepare receipt data
    const { formattedCart, receiptTransaction } = prepareReceiptData(transaction, transaction.items);
    
    // set state for viewing receipt
    setSelectedTransaction(receiptTransaction);
    setReceiptCart(formattedCart);
    setViewingReceipt(true);
  };

  // handle printing receipt using shared utility
  const handlePrintReceipt = () => {
    printReceipt(receiptRef);
  };

  // reset to transaction list view
  const resetToTransactionList = () => {
    setViewingReceipt(false);
    setSelectedTransaction(null);
    setReceiptCart([]);
  };

  // date filter function
  const getDateFilter = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(selectedFilter) {
      case 'today': {
        const todayStr = today.toISOString().split('T')[0];
        return (date) => date?.split('T')[0] === todayStr;
      }
      case 'week': {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return (date) => new Date(date) >= oneWeekAgo;
      }
      case 'month': {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return (date) => new Date(date) >= oneMonthAgo;
      }
      default:
        return () => true; // 'all' case - no date filtering
    }
  }, [selectedFilter]);

  // search filter function
  const getSearchFilter = useMemo(() => {
    if (!searchTerm.trim()) return () => true;
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    
    return (transaction) => (
      (transaction.sales_number?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (transaction.customer_name?.toLowerCase() || '').includes(lowerSearchTerm) ||
      (transaction.cashier_name?.toLowerCase() || '').includes(lowerSearchTerm)
    );
  }, [searchTerm]);

  // filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => 
      getSearchFilter(transaction) && 
      getDateFilter(transaction.transaction_date)
    );
  }, [transactions, getSearchFilter, getDateFilter]);

  // sort transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortField === 'transaction_date') {
        const dateA = new Date(a.transaction_date || '');
        const dateB = new Date(b.transaction_date || '');
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'total_amount') {
        const amountA = parseFloat(a.total_amount || 0);
        const amountB = parseFloat(b.total_amount || 0);
        return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
      } else {
        const valueA = (a[sortField] || '').toString().toLowerCase();
        const valueB = (b[sortField] || '').toString().toLowerCase();
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
    });
  }, [filteredTransactions, sortField, sortDirection]);

  // handle sort
  const handleSort = (field) => {
    setSortDirection(field === sortField ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortField(field);
  };

  const columns = [
    { field: 'sales_number', label: 'No. Transaksi' },
    { field: 'transaction_date', label: 'Tanggal' },
    { field: 'customer_name', label: 'Pelanggan' },
    { field: 'cashier_name', label: 'Sales' },
    { field: 'total_amount', label: 'Total' },
  ];

  // render loading state
  if (isLoading) {
    return (
      <div className={`w-full ${colors.appBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto" />
          <p className="mt-4">loading data...</p>
        </div>
      </div>
    );
  }
  
  // render error state
  if (error) {
    return (
      <div className={`w-full ${colors.appBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md w-full">
          <strong className="font-bold">error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => window.location.reload()}
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  // render receipt view if viewing a receipt
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

  // transaction list view
  return (
    <div className={`w-full min-h-screen ${colors.appBg} ${colors.transition}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`rounded-lg ${colors.cardBg} ${colors.shadow} p-4 mb-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className={`text-xl font-semibold ${colors.textColor} mb-4 md:mb-0`}>
              Transaction History
            </h2>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className={colors.textMuted} />
                </div>
                <input
                  type="text"
                  placeholder="search transaction, customer, or sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className={colors.textMuted} />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className={`appearance-none w-full pl-10 pr-8 py-2 rounded-full border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} ${colors.inputFocus} focus:outline-none focus:ring-2`}
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={16} className={colors.textMuted} />
                </div>
              </div>
            </div>
          </div>
          
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
                            <ArrowUp size={14} /> : 
                            <ArrowDown size={14} />
                        ) : (
                          <div className="w-3.5" /> 
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
                      <tr className={`${colors.tableHover} ${colors.transition}`}>
                        <td className="px-4 py-3">{transaction.sales_number}</td>
                        <td className="px-4 py-3">{formatDate(transaction.transaction_date)}</td>
                        <td className="px-4 py-3">{transaction.customer_name}</td>
                        <td className="px-4 py-3">{transaction.cashier_name}</td>
                        <td className="px-4 py-3">{formatCurrency(transaction.total_amount)}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => toggleRowExpansion(transaction.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonSecondary} text-sm ${colors.transition}`}
                          >
                            <Eye size={14} />
                            <span>{expandedRows[transaction.id] ? 'Close' : 'Detail'}</span>
                          </button>
                          <button
                            onClick={() => viewReceipt(transaction)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${colors.buttonPrimary} text-sm ${colors.transition}`}
                          >
                            <FileText size={14} />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                      {expandedRows[transaction.id] && (
                        <tr className={`${colors.tableBg}`}>
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
                              
                              {loadingDetails[transaction.id] ? (
                                <div className="text-center py-4">
                                  <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
                                  <p className={`${colors.textMuted}`}>loading item details...</p>
                                </div>
                              ) : transaction.items ? (
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
                              ) : (
                                <div className="text-center py-4">
                                  <p className={`${colors.textMuted}`}>no item details available</p>
                                </div>
                              )}
                              
                              <p className={`text-right text-xs ${colors.textMuted} mt-2`}>
                                Printed by: {transaction.printed_by || '-'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center">
                      <p className={`${colors.textMuted}`}>
                        {transactions.length > 0 
                          ? 'No transactions found'
                          : 'No transactions available'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <p className={`${colors.textMuted} text-sm`}>
              total transaksi: {filteredTransactions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
