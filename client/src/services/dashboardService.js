import * as apiService from './apiService';

// fetch all dashboard data
export const fetchDashboardData = async () => {
  // fetch all transactions
  const transactionsData = await apiService.getTransactions();
  
  // calculate revenues and popular products
  const { todayRevenue, monthlyRevenue, popularProducts } = calculateDashboardMetrics(transactionsData);
  
  // get recent transactions (latest 4)
  const recentTransactions = await fetchRecentTransactions(transactionsData);

  return {
    todayRevenue,
    monthlyRevenue,
    popularProducts,
    recentTransactions
  };
};

// calculate dashboard metrics from transactions
export const calculateDashboardMetrics = (transactions) => {
  // calculate today's revenue
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(
    trans => trans.transaction_date && trans.transaction_date.split('T')[0] === today
  );
  const todayRevenue = todayTransactions.reduce(
    (sum, trans) => sum + parseFloat(trans.total_amount || 0), 0
  );

  // calculate monthly revenue
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = transactions.filter(trans => {
    if (!trans.transaction_date) return false;
    const transDate = new Date(trans.transaction_date);
    return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyTransactions.reduce(
    (sum, trans) => sum + parseFloat(trans.total_amount || 0), 0
  );

  // calculate popular products from transactions
  const productCounts = {};
  transactions.forEach(transaction => {
    if (transaction.items && Array.isArray(transaction.items)) {
      transaction.items.forEach(item => {
        if (item.product_name) {
          productCounts[item.product_name] = (productCounts[item.product_name] || 0) + 1;
        }
      });
    }
  });

  // convert to array and sort by count
  const popularProducts = Object.entries(productCounts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return { todayRevenue, monthlyRevenue, popularProducts };
};

// fetch recent transactions with details
export const fetchRecentTransactions = async (transactions) => {
  // sort by date descending and take latest 4
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.transaction_date || '') - new Date(a.transaction_date || ''))
    .slice(0, 4);
  
  // fetch transaction details for each recent transaction
  return Promise.all(
    sortedTransactions.map(async (transaction) => {
      try {
        // only fetch details if valid transaction id present
        if (transaction.id) {
          const details = await apiService.getTransactionById(transaction.id);
          return { ...transaction, items: details.items || [] };
        }
        return { ...transaction, items: [] };
      } catch (err) {
        console.error(`error fetching details for transaction ${transaction.id}:`, err);
        return { ...transaction, items: [] };
      }
    })
  );
};
