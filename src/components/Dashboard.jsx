import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import useColorClasses from '../hooks/useColorClasses';
import db from '../data/database';
import { 
  Bike, 
  Wrench, 
  LineChart, 
  Users, 
  Calendar,
  Clock
} from 'lucide-react';

// Dashboard component for RJC motorcycle service
const Dashboard = () => {
  const { colors } = useOutletContext();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Load dashboard data on component mount
  useEffect(() => {
    // Calculate today's revenue
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = db.transactions.filter(
      trans => trans.transaction_date.split('T')[0] === today
    );
    const todayTotal = todayTransactions.reduce((sum, trans) => sum + trans.total, 0);
    setTodayRevenue(todayTotal);

    // Calculate monthly revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = db.transactions.filter(trans => {
      const transDate = new Date(trans.transaction_date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    });
    const monthlyTotal = monthlyTransactions.reduce((sum, trans) => sum + trans.total, 0);
    setMonthlyRevenue(monthlyTotal);

    // Calculate popular products
    const productSales = {};
    db.transaction_items.forEach(item => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = 0;
      }
      productSales[item.product_id] += item.quantity;
    });

    // Transform to array and sort by quantity
    const popularProductsArray = Object.entries(productSales).map(([productId, quantity]) => {
      const product = db.products.find(p => p.id === productId);
      return {
        id: productId,
        name: product ? product.name : 'Unknown Product',
        quantity
      };
    }).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    setPopularProducts(popularProductsArray);

    // Get recent transactions
    const sortedTransactions = [...db.transactions]
      .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
      .slice(0, 4);

    // Add items to transactions
    const transactionsWithItems = sortedTransactions.map(transaction => {
      const items = db.transaction_items.filter(item => 
        item.transaction_id === transaction.id
      );
      return { ...transaction, items };
    });

    setRecentTransactions(transactionsWithItems);
  }, []);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
        <div className={`${colors.cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <LineChart size={24} />
            </div>
            <div className="ml-4">
              <p className={`${colors.textMuted} text-sm`}>Today's Revenue</p>
              <h3 className={`${colors.textColor} text-xl font-bold`}>{formatCurrency(todayRevenue)}</h3>
            </div>
          </div>
        </div>

        <div className={`${colors.cardBg} rounded-lg shadow p-6`}>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Calendar size={24} />
            </div>
            <div className="ml-4">
              <p className={`${colors.textMuted} text-sm`}>Monthly Sales</p>
              <h3 className={`${colors.textColor} text-xl font-bold`}>{formatCurrency(monthlyRevenue)}</h3>
            </div>
          </div>
        </div>
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
              <p className={`${colors.textMuted}`}>No product data available</p>
            )}
          </div>
        </div>

        {/* quick actions card */}
        <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-2`}>
          <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/pos')}
              className={`flex flex-col items-center justify-center ${colors.buttonPrimary} p-4 rounded-lg transition-transform hover:scale-105`}
            >
              <Bike size={24} />
              <span className="mt-2 text-sm">Point of Sales</span>
            </button>

            <button 
              onClick={() => navigate('/history')}
              className={`flex flex-col items-center justify-center bg-green-600 text-white p-4 rounded-lg transition-transform hover:scale-105`}
            >
              <Clock size={24} />
              <span className="mt-2 text-sm">Transaction History</span>
            </button>

            <button 
              className={`flex flex-col items-center justify-center bg-purple-600 text-white p-4 rounded-lg transition-transform hover:scale-105`}
            >
              <Users size={24} />
              <span className="mt-2 text-sm">...</span>
            </button>
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
            <thead className={colors.tableBg}>
              <tr className={`border-b ${colors.border}`}>
                <th className="text-left py-3 px-4">No. Transaksi</th>
                <th className="text-left py-3 px-4">Tanggal</th>
                <th className="text-left py-3 px-4">Pelanggan</th>
                <th className="text-left py-3 px-4">Sales</th>
                <th className="text-left py-3 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => {
                  // Get the first service/product item from the transaction
                  const firstItem = transaction.items[0];
                  const product = firstItem ? 
                    db.products.find(p => p.id === firstItem.product_id)?.name || 'Unknown Service' : 
                    'Multiple Services';
                  
                  return (
                    <tr key={transaction.id} className={`border-b ${colors.border} hover:bg-gray-50`}>
                      <td className="py-3 px-4">{transaction.sales_number}</td>
                      <td className="py-3 px-4">{formatDate(transaction.transaction_date)}</td>
                      <td className="py-3 px-4">{transaction.customer_name}</td>
                      <td className="px-4 py-3">{transaction.cashier_name}</td>
                      <td className="py-3 px-4">{formatCurrency(transaction.total)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center">
                    <p className={colors.textMuted}>No recent transactions found</p>
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
