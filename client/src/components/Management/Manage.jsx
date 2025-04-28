import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, Users } from 'lucide-react';
import * as apiService from '../../services/apiService';
import ProductsTab from './ProductsTab';
import SalesTab from './SalesTab';
import CommonUI from '../UI/CommonUI';
import TabButton from '../UI/TabButton';
import DashboardHeader from '../UI/ManageHeader';

const Manage = () => {
  const { colors } = useOutletContext();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [error, setError] = useState(null);
  
  // load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // fetch all necessary data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // fetch products and cashiers in parallel
      const [productsData, cashiersData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCashiers()
      ]);
      
      setProducts(productsData);
      setCashiers(cashiersData);
    } catch (err) {
      console.error('error fetching data:', err);
      setError('failed to load data. please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // reload specific data
  const reloadProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await apiService.getProducts();
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('error reloading products:', err);
      setError('failed to reload products');
    } finally {
      setIsLoading(false);
    }
  };
  
  const reloadCashiers = async () => {
    try {
      setIsLoading(true);
      const cashiersData = await apiService.getCashiers();
      setCashiers(cashiersData);
      setError(null);
    } catch (err) {
      console.error('error reloading cashiers:', err);
      setError('failed to reload cashiers');
    } finally {
      setIsLoading(false);
    }
  };
  
  // loading state
  if (isLoading) {
    return <CommonUI.LoadingView colors={colors} />;
  }
  
  // error state
  if (error) {
    return <CommonUI.ErrorView colors={colors} error={error} />;
  }
  
  const tabs = [
    {
      id: 'products',
      label: 'Products',
      icon: Package
    },
    {
      id: 'sales',
      label: 'Sales Team',
      icon: Users
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header section */}
      <DashboardHeader 
        colors={colors} 
        title="Management Dashboard"
        subtitle="Manage your products and sales team members"
      />
      
      {/* tabs and content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* sidebar */}
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-4 h-fit md:sticky md:top-4`}>
          <h2 className={`text-xl font-semibold mb-4 ${colors.textColor}`}>Tabs</h2>
          
          <div className="space-y-2">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                icon={tab.icon}
                label={tab.label}
                colors={colors}
              />
            ))}
          </div>
        </div>
        
        {/* main content */}
        <div className="md:col-span-3">
          {activeTab === 'products' ? (
            <ProductsTab 
              products={products} 
              colors={colors} 
              reloadProducts={reloadProducts}
            />
          ) : (
            <SalesTab 
              cashiers={cashiers} 
              colors={colors} 
              reloadCashiers={reloadCashiers}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
