import React, { useState, useEffect } from 'react';
import useColorClasses from '../hooks/useColorClasses';
import { 
  Bike, 
  Wrench, 
  LineChart, 
  Users, 
  Calendar 
} from 'lucide-react';

// dashboard component for rjc motorcycle service
const Dashboard = () => {
  const { colors } = useColorClasses(false);

  // format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
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
              <h3 className={`${colors.textColor} text-xl font-bold`}>0</h3>
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
              <h3 className={`${colors.textColor} text-xl font-bold`}>0</h3>
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
              <div className={`flex items-center justify-between`}>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100">
                    <Wrench className="text-gray-600" size={20} />
                  </div>
                  <span className="ml-3">Product Name</span>
                </div>
                <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  0
                </div>
              </div>
          </div>
        </div>

        {/* quick actions card */}
        <div className={`${colors.cardBg} rounded-lg shadow p-6 lg:col-span-2`}>
          <h2 className={`${colors.textColor} text-xl font-bold mb-4`}>Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button className={`flex flex-col items-center justify-center ${colors.buttonPrimary} p-4 rounded-lg transition-transform hover:scale-105`}>
              <Bike size={24} />
              <span className="mt-2 text-sm">Point of Sales</span>
            </button>

            <button className={`flex flex-col items-center justify-center bg-green-600 text-white p-4 rounded-lg transition-transform hover:scale-105`}>
              <Wrench size={24} />
              <span className="mt-2 text-sm">Transaction History</span>
            </button>

            <button className={`flex flex-col items-center justify-center bg-purple-600 text-white p-4 rounded-lg transition-transform hover:scale-105`}>
              <Users size={24} />
              <span className="mt-2 text-sm">...</span>
            </button>
          </div>
        </div>
      </div>

      {/* recent transactions preview */}
      <div className={`${colors.cardBg} rounded-lg shadow p-6 mt-8`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`${colors.textColor} text-xl font-bold`}>Riwayat Transaksi</h2>
          <button className="text-blue-600 hover:underline text-sm">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={colors.tableBg}>
              <tr className={`border-b ${colors.border}`}>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Service</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-center py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TRX-001', customer: 'Ahmad Rizki', service: 'Tune Up', amount: 350000, status: 'Completed', date: '2025-04-26' },
                { id: 'TRX-002', customer: 'Budi Santoso', service: 'Oil Change', amount: 180000, status: 'Completed', date: '2025-04-26' },
                { id: 'TRX-003', customer: 'Dewi Putri', service: 'Brake Pad Replacement', amount: 450000, status: 'In Progress', date: '2025-04-25' },
                { id: 'TRX-004', customer: 'Faisal Ahmad', service: 'Battery Replacement', amount: 275000, status: 'Pending', date: '2025-04-25' },
              ].map((transaction, index) => (
                <tr key={index} className={`border-b ${colors.border} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                  <td className="py-3 px-4">{transaction.id}</td>
                  <td className="py-3 px-4">{transaction.customer}</td>
                  <td className="py-3 px-4">{transaction.service}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(transaction.amount)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
