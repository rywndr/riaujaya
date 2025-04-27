import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatCard, ActionButton } from '../components/DashCards';
import * as apiService from '../services/apiService';
import { 
  ShoppingCart,
  Wrench, 
  LineChart, 
  Calendar,
  Settings,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { colors } = useOutletContext();
  const navigate = useNavigate();
  
  // state for dashboard data
  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    monthlyRevenue: 0,
    popularProducts: [],
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // load data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // fetch all transactions
        const transactionsData = await apiService.getTransactions();
        
        // calculate revenues and popular products
        const { todayRevenue, monthlyRevenue, popularProducts } = calculateDashboardMetrics(transactionsData);
        
        // get recent transactions (latest 4)
        const recentTransactions = await fetchRecentTransactions(transactionsData);

        setDashboardData({
          todayRevenue,
          monthlyRevenue,
          popularProducts,
          recentTransactions
        });
        
        setError(null);
      } catch (err) {
        setError('failed to load dashboard data. please try again later.');
        console.error('error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // calculate dashboard metrics from transactions
  const calculateDashboardMetrics = (transactions) => {
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
  const fetchRecentTransactions = async (transactions) => {
    // sort by date descending and take latest 4
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(b.transaction_date || '') - new Date(a.transaction_date || ''))
      .slice(0, 4);
    
    // fetch transaction details for each recent transaction
    return Promise.all(
      sortedTransactions.map(async (transaction) => {
        try {
          // only fetch details if valid transaction ID present
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

  // loading state
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
  
  // error state
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

  const { todayRevenue, monthlyRevenue, popularProducts, recentTransactions } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* welcome section */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-8`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${colors.textColor}`}>Welcome to RJC Dashboard</h1>
            <p className={`${colors.textMuted} mt-2`}>PT.RIAUJAYA CEMERLANG - Suzuki Motorcycle Service Specialist</p>
          </div>
        </div>
      </div>

      {/* statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* today's revenue */}
        <StatCard 
          icon={<LineChart size={24} />} 
          iconBg="bg-blue-100 text-blue-600"
          title="Today's Revenue" 
          value={formatCurrency(todayRevenue)}
          colors={colors}
        />

        {/* monthly sales */}
        <StatCard 
          icon={<Calendar size={24} />} 
          iconBg="bg-green-100 text-green-600"
          title="Monthly Sales" 
          value={formatCurrency(monthlyRevenue)}
          colors={colors}
        />
      </div>

      {/* main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* popular products */}
        <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-1`}>
          <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Popular Products</h2>
          <div className="space-y-4">
            {popularProducts.length > 0 ? (
              popularProducts.map((product, index) => (
                <div key={index} className={`flex items-center justify-between`}>
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100">
                      <Wrench className="text-gray-600" size={20} />
                    </div>
                    <span className={`ml-3 ${colors.textColor}`}>{product.name}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {product.quantity}
                  </div>
                </div>
              ))
            ) : (
              <p className={`${colors.textMuted}`}>no product data available</p>
            )}
          </div>
        </div>

        {/* quick actions card */}
        <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-2`}>
          <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ActionButton 
              icon={<ShoppingCart size={24} />}
              label="Point of Sales"
              bgColor={colors.buttonPrimary}
              onClick={() => navigate('/pos')}
            />

            <ActionButton 
              icon={<Clock size={24} />}
              label="Transaction History"
              bgColor="bg-amber-600 text-white"
              onClick={() => navigate('/history')}
            />

            <ActionButton 
              icon={<Settings size={24} />}
              label="Manage"
              bgColor="bg-red-500 text-white"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* recent transactions preview */}
      <div className={`${colors.cardBg} rounded-lg shadow p-6 mt-8`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${colors.textColor} text-xl font-bold`}>Recent Transactions</h2>
          <Link to="/history" className="text-blue-600 hover:underline text-sm">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${colors.tableBg}`}>
              <tr className={`border-b ${colors.border} ${colors.tableText} `}>
                <th className="text-left py-3 px-4">No. Transaksi</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Pelanggan</th>
                <th className="text-left py-3 px-4">Sales</th>
                <th className="text-left py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className={`border-b ${colors.border} ${colors.tableText} ${colors.tableHover}`}>
                    <td className="py-3 px-4">{transaction.sales_number}</td>
                    <td className="py-3 px-4">{formatDate(transaction.transaction_date)}</td>
                    <td className="py-3 px-4">{transaction.customer_name || 'KONSUMEN BENGKEL'}</td>
                    <td className="px-4 py-3">{transaction.cashier_name}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.total_amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center">
                    <p className={colors.textMuted}>no recent transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
