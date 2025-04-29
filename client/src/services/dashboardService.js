import * as apiService from './apiService';

// fetch all dashboard data
export const fetchDashboardData = async () => {
  // fetch all transactions
  const transactionsData = await apiService.getTransactions();
  
  // calculate revenues
  const { todayRevenue, monthlyRevenue } = calculateRevenueMetrics(transactionsData);
  
  // get recent transactions (latest 4)
  const recentTransactions = await fetchRecentTransactions(transactionsData);

  // get popular products with actual quantities sold
  const popularProducts = await fetchPopularProducts(transactionsData);

  return {
    todayRevenue,
    monthlyRevenue,
    popularProducts,
    recentTransactions
  };
};

// calculate revenue metrics from transactions
export const calculateRevenueMetrics = (transactions) => {
  // calculate today's revenue using local date comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayTransactions = transactions.filter(trans => {
    if (!trans.transaction_date) return false;
    
    // parse transaction date and reset hours for date comparison
    const transDate = new Date(trans.transaction_date);
    transDate.setHours(0, 0, 0, 0);
    
    // compare date components instead of strings
    return (
      transDate.getDate() === today.getDate() &&
      transDate.getMonth() === today.getMonth() &&
      transDate.getFullYear() === today.getFullYear()
    );
  });
  
  const todayRevenue = todayTransactions.reduce(
    (sum, trans) => sum + parseFloat(trans.total_amount || 0), 0
  );

  // calculate monthly revenue
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthlyTransactions = transactions.filter(trans => {
    if (!trans.transaction_date) return false;
    const transDate = new Date(trans.transaction_date);
    return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyTransactions.reduce(
    (sum, trans) => sum + parseFloat(trans.total_amount || 0), 0
  );

  return { todayRevenue, monthlyRevenue };
};

// fetch popular products based on transaction history
export const fetchPopularProducts = async (transactions) => {
  // get sample of most recent transactions to analyze
  // Limit to most recent 50 transactions for performance
  const transactionSample = [...transactions]
    .sort((a, b) => new Date(b.transaction_date || '') - new Date(a.transaction_date || ''))
    .slice(0, 50);
  
  // track product quantities sold
  const productQuantities = {};
  
  // fetch transaction details for the sample
  await Promise.all(
    transactionSample.map(async (transaction) => {
      try {
        if (transaction.id) {
          const details = await apiService.getTransactionById(transaction.id);
          
          if (details.items && Array.isArray(details.items)) {
            details.items.forEach(item => {
              if (item.product_name) {
                // Count by actual quantity sold, not just occurrence
                const soldQuantity = parseInt(item.quantity) || 1;
                if (!productQuantities[item.product_name]) {
                  productQuantities[item.product_name] = 0;
                }
                productQuantities[item.product_name] += soldQuantity;
              }
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching details for transaction ${transaction.id}:`, err);
      }
    })
  );
  
  // convert to array and sort by quantity sold
  const popularProducts = Object.entries(productQuantities)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
  
  return popularProducts;
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
