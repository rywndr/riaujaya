import { useState, useEffect, useMemo, useRef } from 'react';
import { prepareReceiptData, printReceipt } from '../utils/receiptUtils';
import * as apiService from '../services/apiService';

export const useTransactions = () => {
  // states
  const [transactions, setTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState({});
  const [error, setError] = useState(null);
  
  // search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // sort states
  const [sortField, setSortField] = useState('transaction_date');
  const [sortDirection, setSortDirection] = useState('desc');

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // receipt states
  const [viewingReceipt, setViewingReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [receiptCart, setReceiptCart] = useState([]);
  
  // delete states
  const [isDeleting, setIsDeleting] = useState({});
  const [deleteError, setDeleteError] = useState(null);
  
  // reference to receipt element for printing
  const receiptRef = useRef(null);

  // load transactions on hook mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

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

  // delete transaction function
  const deleteTransaction = async (transactionId) => {
    try {
      setIsDeleting(prev => ({ ...prev, [transactionId]: true }));
      setDeleteError(null);
      
      await apiService.deleteTransaction(transactionId);
      
      // remove transaction from state
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      
      // also clean up expandedRows state
      setExpandedRows(prev => {
        const newState = { ...prev };
        delete newState[transactionId];
        return newState;
      });
      
      return true;
    } catch (err) {
      console.error('error deleting transaction:', err);
      setDeleteError(`failed to delete transaction: ${err.message}`);
      return false;
    } finally {
      setIsDeleting(prev => ({ ...prev, [transactionId]: false }));
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

  // handle printing receipt
  const handlePrintReceipt = () => {
    if (receiptRef.current) {
      printReceipt(receiptRef);
    }
  };

  // reset to transaction list view
  const resetToTransactionList = () => {
    setViewingReceipt(false);
    setSelectedTransaction(null);
    setReceiptCart([]);
  };

  // date filter function
  const getDateFilter = useMemo(() => {
    // use local timezone for date comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(selectedFilter) {
      case 'today': {
        return (dateStr) => {
          if (!dateStr) return false;
          // parse date and reset to midnight for comparison
          const transactionDate = new Date(dateStr);
          transactionDate.setHours(0, 0, 0, 0);
          
          // same day comparison using local time
          return (
            transactionDate.getDate() === today.getDate() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        };
      }
      case 'week': {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return (dateStr) => {
          if (!dateStr) return false;
          const transactionDate = new Date(dateStr);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate >= oneWeekAgo;
        };
      }
      case 'month': {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return (dateStr) => {
          if (!dateStr) return false;
          const transactionDate = new Date(dateStr);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate >= oneMonthAgo;
        };
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

  // paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTransactions, currentPage, itemsPerPage]);

  // calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / itemsPerPage);
  }, [filteredTransactions, itemsPerPage]);

  // handle sort
  const handleSort = (field) => {
    setSortDirection(field === sortField ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortField(field);
  };

  // handle page change
  const handlePageChange = (pageNumber) => {
    // Ensure page number is within valid range
    const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPageNumber);
  };

  // handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); 
  };

  return {
    transactions,
    sortedTransactions: paginatedTransactions,
    filteredTransactions,
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
    currentPage,
    itemsPerPage,
    totalPages,
    handlePageChange,
    handleItemsPerPageChange
  };
};
