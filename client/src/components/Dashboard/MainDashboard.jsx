import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { fetchDashboardData } from '../../services/dashboardService';
import CommonUI from '../UI/CommonUI';
import { 
  WelcomeCard,
  StatsSection,
  PopularProductsCard,
  QuickActionsCard,
  RecentTransactionsCard
} from './DashComponents';

// main dashboard component with cleaner structure
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
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('failed to load dashboard data. please try again later.');
        console.error('error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // handle loading and error states
  if (isLoading) return <CommonUI.LoadingView colors={colors} />;
  if (error) return <CommonUI.ErrorView colors={colors} error={error} />;

  // destructure data for components
  const { todayRevenue, monthlyRevenue, popularProducts, recentTransactions } = dashboardData;

  // render dashboard with separated components
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WelcomeCard colors={colors} />
      
      <StatsSection 
        todayRevenue={todayRevenue} 
        monthlyRevenue={monthlyRevenue} 
        colors={colors} 
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PopularProductsCard 
          products={popularProducts} 
          colors={colors} 
        />
        <QuickActionsCard 
          colors={colors} 
          navigate={navigate} 
        />
      </div>
      <RecentTransactionsCard 
        transactions={recentTransactions} 
        colors={colors} 
      />
    </div>
  );
};

export default Dashboard;
