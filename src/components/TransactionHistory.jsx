import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import db from '../data/database';
import useColorClasses from '../hooks/useColorClasses';
import ProfileDropdown from './ProfileDropdown';

const TransactionHistory = () => {
  // get shared colors and dark mode from layout context
  const { user, signOut } = useAuth();

  const { colors } = useOutletContext();

  // states
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortField, setSortField] = useState('transaction_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRows, setExpandedRows] = useState({});

  // load transactions on component mount
  useEffect(() => {
    // get transactions from db and add transaction items
    const loadedTransactions = db.transactions.map(transaction => {
      const items = db.transaction_items.filter(item => 
        item.transaction_id === transaction.id
      );
      return { ...transaction, items };
    });
    setTransactions(loadedTransactions);
  }, []);

  // toggle expanded row
  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.sales_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.cashier_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') {
      return matchesSearch;
    } else if (selectedFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      const transactionDate = transaction.transaction_date.split('T')[0];
      return matchesSearch && transactionDate === today;
    } else if (selectedFilter === 'week') {
      const today = new Date();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      const transactionDate = new Date(transaction.transaction_date);
      return matchesSearch && transactionDate >= oneWeekAgo;
    } else if (selectedFilter === 'month') {
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      const transactionDate = new Date(transaction.transaction_date);
      return matchesSearch && transactionDate >= oneMonthAgo;
    }
    return matchesSearch;
  });

  // sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'transaction_date') {
      const dateA = new Date(a.transaction_date);
      const dateB = new Date(b.transaction_date);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'total') {
      return sortDirection === 'asc' ? a.total - b.total : b.total - a.total;
    } else {
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  // handle sort
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // get sort icon
  const getSortIcon = (field) => {
    if (field !== sortField) return '⇵';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // handle product lookup by id
  const getProductName = (productId) => {
    const product = db.products.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className={`w-full min-h-screen ${colors.appBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`rounded-lg ${colors.cardBg} shadow-md p-4 mb-6`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className={`text-xl font-semibold ${colors.textColor} mb-2 md:mb-0`}>Riwayat Transaksi</h2>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Cari nomor, pelanggan, atau sales..."his
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`px-3 py-2 rounded border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className={`px-3 py-2 rounded border ${colors.inputBorder} ${colors.inputBg} ${colors.textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">Semua</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${colors.tableBg}`}>
                <tr>
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
                  <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('total')}>
                    <div className="flex items-center">
                      <span>Total</span>
                      <span className="ml-1">{getSortIcon('total')}</span>
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
                        <td className="px-4 py-3">{formatCurrency(transaction.total)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleRowExpansion(transaction.id)}
                            className={`px-3 py-1 rounded ${colors.buttonSecondary} text-sm transition-colors duration-200`}
                          >
                            {expandedRows[transaction.id] ? 'Tutup' : 'Detail'}
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
                                    No. Telepon: {transaction.customer_phone || '-'}
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
                                    Diskon: {formatCurrency(transaction.discount)}
                                  </p>
                                  <p className={`${colors.textColor} font-semibold`}>
                                    Total: {formatCurrency(transaction.total)}
                                  </p>
                                </div>
                              </div>
                              
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
                                        <td className="py-1">{getProductName(item.product_id)}</td>
                                        <td className="text-right py-1">{formatCurrency(item.unit_price)}</td>
                                        <td className="text-right py-1">{item.quantity}</td>
                                        <td className="text-right py-1">{item.discount_percentage}%</td>
                                        <td className="text-right py-1">{formatCurrency(item.total_price)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <p className={`text-right text-xs ${colors.textMuted}`}>
                                Dicetak oleh: {transaction.printed_by}
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
                          ? 'Tidak ada transaksi yang cocok dengan pencarian.' 
                          : 'Belum ada transaksi.'}
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
