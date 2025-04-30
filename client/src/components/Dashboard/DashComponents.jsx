import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import { 
  ShoppingCart,
  Wrench, 
  LineChart, 
  Calendar,
  Settings,
  Clock,
} from 'lucide-react';

// welcome card component
export const WelcomeCard = ({ colors }) => (
  <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-8`}>
    <div className="flex items-center justify-between">
      <div>
        <h1 className={`text-3xl font-bold ${colors.textColor}`}>Welcome to RJC Dashboard</h1>
        <p className={`${colors.textMuted} mt-2`}>PT.RIAUJAYA CEMERLANG - Suzuki Motorcycle Service Specialist</p>
      </div>
    </div>
  </div>
);

// stats section component
export const StatsSection = ({ todayRevenue, monthlyRevenue, colors }) => (
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
);

// popular products card
export const PopularProductsCard = ({ products, colors }) => (
  <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-1`}>
    <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Popular Products</h2>
    <div className="space-y-4">
      {products.length > 0 ? (
        products.map((product, index) => (
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
);

// quick actions card
export const QuickActionsCard = ({ colors, navigate }) => (
  <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-2`}>
    <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Quick Actions</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <QuickActions
        icon={<ShoppingCart size={24} />}
        label="Point of Sales"
        bgColor={colors.buttonPrimary}
        onClick={() => navigate('/pos')}
      />

      <QuickActions
        icon={<Clock size={24} />}
        label="Transaction History"
        bgColor="bg-amber-600 text-white"
        onClick={() => navigate('/history')}
      />

      <QuickActions
        icon={<Settings size={24} />}
        label="Manage"
        bgColor="bg-red-500 text-white"
        onClick={() => navigate('/manage')}
      />
    </div>
  </div>
);

// recent transactions card
export const RecentTransactionsCard = ({ transactions, colors }) => (
  <div className={`${colors.cardBg} rounded-lg shadow p-6 mt-8`}>
    <div className="flex justify-between items-center mb-4">
      <h2 className={`${colors.textColor} text-xl font-bold`}>Recent Transactions</h2>
      <Link to="/history" className="text-blue-600 hover:underline text-sm">View All</Link>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className={`${colors.tableBg}`}>
          <tr className={`border-b ${colors.border} ${colors.tableText} `}>
            <th className="text-left py-3 px-4">#Transaction</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-left py-3 px-4">Customer</th>
            <th className="text-left py-3 px-4">Sales</th>
            <th className="text-left py-3 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
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
);
