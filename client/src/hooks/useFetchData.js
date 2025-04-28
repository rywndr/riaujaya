import { useState, useEffect } from 'react';
import * as apiService from '../services/apiService';

export const useFetchData = () => {
  // api data states
  const [products, setProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // fetch initial data from api
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // fetch products and cashiers in parallel
        const [productsData, cashiersData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCashiers()
        ]);
        
        setProducts(productsData);
        setCashiers(cashiersData);
        setError(null);
      } catch (err) {
        setError(`failed to load data: ${err.message}`);
        console.error('data fetching error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    products,
    cashiers,
    isLoading,
    error
  };
};
