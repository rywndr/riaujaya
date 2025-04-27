import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Package, 
  Users, 
  Loader, 
  Search, 
  PlusCircle, 
  Edit2, 
  Trash,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import * as apiService from '../services/apiService';
import ProductsTab from './ProductsTab';
import SalesTab from './SalesTab';

const Manage = () => {
  const { colors } = useOutletContext();
  const [activeTab, setActiveTab] = useState('products');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [error, setError] = useState(null);
  
  // load data on mount
  useEffect(() => {
    const fetchData = async () => {
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
    
    fetchData();
  }, []);
  
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
    return (
      <div className={`w-full ${colors.pageBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 mx-auto" />
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* header section */}
      <div className={`${colors.cardBg} rounded-lg shadow-lg p-6 mb-8`}>
        <h1 className={`text-3xl font-bold ${colors.textColor}`}>Management Dashboard</h1>
        <p className={`${colors.textMuted} mt-2`}>Manage your products and sales team members</p>
      </div>
      
      {/* tabs and content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* sidebar */}
        <div className={`${colors.cardBg} rounded-lg shadow-lg p-4 h-fit md:sticky md:top-4`}>
          <h2 className={`text-xl font-semibold mb-4 ${colors.textColor}`}>Tabs</h2>
          
          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
                activeTab === 'products' 
                  ? `${colors.buttonPrimary}` 
                  : `${colors.buttonOutline}`
              }`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} className="mr-2" />
              <span>Products</span>
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200 ${
                activeTab === 'sales' 
                  ? `${colors.buttonPrimary}` 
                  : `${colors.buttonOutline}`
              }`}
              onClick={() => setActiveTab('sales')}
            >
              <Users size={18} className="mr-2" />
              <span>Sales Team</span>
            </button>
          </div>
        </div>
        
        {/* main content area */}
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
