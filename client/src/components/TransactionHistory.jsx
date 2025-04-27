import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';
import * as apiService from '../services/apiService';

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
        customer_name: transaction.customer_name || 'KONSUMEN BENGKEL',
        cashier_name: transaction.cashier_name || 'Unknown',
        total_amount: transaction.total_amount || 0,
        customer_phone: transaction.customer_phone || '-',
        subtotal: transaction.subtotal,
        discount: transaction.discount || 0
      }));
      
      setTransactions(formattedTransactions);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions. Please try again later.');
      console.error('Error fetching transactions:', err);
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

  // filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      (transaction.sales_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.cashier_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') {
      return matchesSearch;
    } 
    
    const transactionDate = new Date(transaction.transaction_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedFilter === 'today') {
      const todayDate = today.toISOString().split('T')[0];
      const txDate = transaction.transaction_date?.split('T')[0];
      return matchesSearch && txDate === todayDate;
    } else if (selectedFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return matchesSearch && transactionDate >= oneWeekAgo;
    } else if (selectedFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return matchesSearch && transactionDate >= oneMonthAgo;
    }
    
    return matchesSearch;
  });

  // sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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

  // handle sort
  const handleSort = (field) => {
    setSortDirection(field === sortField ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortField(field);
  };

  // get sort icon
  const getSortIcon = (field) => field !== sortField ? '⇵' : (sortDirection === 'asc' ? '↑' : '↓');

  // render loading state
  if (isLoading) {
    return (
      <div className={`w-full ${colors.pageBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">loading data...</p>
        </div>
      </div>
    );
  }
  
  // render error state
  if (error) {
    return (
      <div className={`w-full ${colors.pageBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md w-full">
          <strong className="font-bold">error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${colors.appBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`rounded-lg ${colors.cardBg} shadow-md p-4 mb-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className={`text-xl font-semibold ${colors.textColor} mb-2 md:mb-0`}>Transaction History</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari nomor, pelanggan, atau sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-2 rounded border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`px-3 py-2 rounded border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${colors.tableBg}`}>
                <tr className={`border-b ${colors.border} ${colors.tableText} `}>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('sales_number')}>
                    <div className="flex items-center">
                      <span>No. Transaksi</span>
                      <span className="ml-1">{getSortIcon('sales_number')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('transaction_date')}>
                    <div className="flex items-center">
                      <span>Tanggal</span>
                      <span className="ml-1">{getSortIcon('transaction_date')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('customer_name')}>
                    <div className="flex items-center">
                      <span>Pelanggan</span>
                      <span className="ml-1">{getSortIcon('customer_name')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('cashier_name')}>
                    <div className="flex items-center">
                      <span>Sales</span>
                      <span className="ml-1">{getSortIcon('cashier_name')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('total_amount')}>
                    <div className="flex items-center">
                      <span>Total</span>
                      <span className="ml-1">{getSortIcon('total_amount')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <span>Detail</span>
                  </th>
                </tr>
              </thead>
              <tbody className={`${colors.textColor}`}>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <tr className={`border-t ${colors.border} ${colors.tableHover} transition-colors duration-200`}>
                        <td className="px-4 py-3">{transaction.sales_number}</td>
                        <td className="px-4 py-3">{formatDate(transaction.transaction_date)}</td>
                        <td className="px-4 py-3">{transaction.customer_name}</td>
                        <td className="px-4 py-3">{transaction.cashier_name}</td>
                        <td className="px-4 py-3">{formatCurrency(transaction.total_amount)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRowExpansion(transaction.id)}
                            className={`px-3 py-1 rounded ${colors.buttonSecondary} text-sm transition-colors duration-200`}
                          >
                            {expandedRows[transaction.id] ? 'Close' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                      {expandedRows[transaction.id] && (
                        <tr className={`${colors.tableBg}`}>
                          <td colSpan="6" className="px-4 py-3">
                            <div className="py-2">
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className={`${colors.textMuted} text-sm`}>
                                    No. Telepon: {transaction.customer_phone}
                                  </p>
                                  <p className={`${colors.textMuted} text-sm`}>
                                    Catatan: {transaction.notes || '-'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className={`${colors.textMuted} text-sm`}>
                                    Subtotal: {formatCurrency(transaction.subtotal)}
                                  </p>
                                  <p className={`${colors.textMuted} text-sm`}>
                                    Diskon: {formatCurrency(transaction.subtotal && transaction.total_amount ? 
                                      Math.max(0, transaction.subtotal - transaction.total_amount) : 0)}
                                  </p>
                                  <p className={`${colors.textColor} font-semibold`}>
                                    Total: {formatCurrency(transaction.total_amount)}
                                  </p>
                                </div>
                              </div>
                              
                              {loadingDetails[transaction.id] ? (
                                <div className="text-center py-4">
                                  <p className={`${colors.textMuted}`}>loading item details...</p>
                                </div>
                              ) : transaction.items ? (
                                <div className="border-t border-b py-2 mb-2">
                                  <h4 className="font-medium mb-2">Item Transaksi:</h4>
                                  <table className="w-full">
                                    <thead>
                                      <tr className="text-sm">
                                        <th className="text-left py-1">Produk</th>
                                        <th className="text-right py-1">Harga</th>
                                        <th className="text-right py-1">Qty</th>
                                        <th className="text-right py-1">Diskon</th>
                                        <th className="text-right py-1">Total</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                      {transaction.items.map((item) => (
                                        <tr key={item.id}>
                                          <td className="py-1">{item.product_name}</td>
                                          <td className="text-right py-1">{formatCurrency(item.unit_price)}</td>
                                          <td className="text-right py-1">{item.quantity}</td>
                                          <td className="text-right py-1">{item.discount_percentage}%</td>
                                          <td className="text-right py-1">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-4">
                                  <p className={`${colors.textMuted}`}>no item details available</p>
                                </div>
                              )}
                              
                              <p className={`text-right text-xs ${colors.textMuted}`}>
                                Dicetak oleh: {transaction.printed_by || '-'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center">
                      <p className={`${colors.textMuted}`}>
                        {transactions.length > 0 
                          ? 'tidak ada transaksi yang cocok dengan pencarian.' 
                          : 'belum ada transaksi.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right">
            <p className={`${colors.textMuted} text-sm`}>
              Total Transaksi: {filteredTransactions.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
