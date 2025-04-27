import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Loader } from 'lucide-react';
import TransactionForm from './TransactionForm';
import Receipt from './Receipt';
import * as formatters from '../utils/formatters';
import * as calculations from '../utils/calculations';
import * as apiService from '../services/apiService';
import { printReceipt, prepareReceiptData } from '../utils/receiptUtils';

const POSSystem = () => {
  // get shared colors and dark mode from layout context
  const { colors } = useOutletContext();

  // combine utils into a single object for ease of use
  const utils = {
    ...formatters,
    ...calculations
  };

  // states
  const [selectedCashierId, setSelectedCashierId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [notes, setNotes] = useState('');
  const [salesNumber, setSalesNumber] = useState('');
  const [printedInfo, setPrintedInfo] = useState('');
  
  // api data states
  const [products, setProducts] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ref to the receipt element for printing
  const receiptRef = useRef(null);
  
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
  
  // calculate subtotal (pre-discount amount)
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  
  // calculate total discount amount
  const totalDiscount = cart.reduce((sum, item) => {
    return sum + utils.calculateDiscountAmount(item.quantity, item.unit_price, item.discount_percentage);
  }, 0);
  
  // calculate final total
  const total = subtotal - totalDiscount;
  
  // cart management
  const cartFunctions = {
    addToCart: (product) => {
      const existingItem = cart.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // if product is in cart, update quantity and total price
        const updatedCart = cart.map(item => {
          if (item.product_id === product.id) {
            const quantity = item.quantity + 1;
            const total_price = utils.calculateTotalPrice(
              quantity, 
              product.unit_price, 
              item.discount_percentage
            );
            return { ...item, quantity, total_price };
          }
          return item;
        });
        setCart(updatedCart);
      } else {
        // add new product to cart with 0% discount by default
        setCart([...cart, {
          product_id: product.id,
          product_name: product.name,
          product_code: product.code,
          unit_price: product.unit_price,
          quantity: 1,
          discount_percentage: 0,
          total_price: product.unit_price
        }]);
      }
    },
    
    removeFromCart: (productId) => {
      setCart(cart.filter(item => item.product_id !== productId));
    },
    
    updateQuantity: (productId, newQuantity) => {
      if (newQuantity <= 0) {
        cartFunctions.removeFromCart(productId);
        return;
      }
      
      setCart(cart.map(item => {
        if (item.product_id === productId) {
          const total_price = utils.calculateTotalPrice(
            newQuantity, 
            item.unit_price, 
            item.discount_percentage
          );
          return { ...item, quantity: newQuantity, total_price };
        }
        return item;
      }));
    },
    
    updateDiscount: (productId, discountPercentage) => {
      // ensure discount is between 0 and 100
      const validDiscount = Math.max(0, Math.min(100, discountPercentage));
      
      setCart(cart.map(item => {
        if (item.product_id === productId) {
          const total_price = utils.calculateTotalPrice(
            item.quantity, 
            item.unit_price, 
            validDiscount
          );
          return { ...item, discount_percentage: validDiscount, total_price };
        }
        return item;
      }));
    }
  };

  // get cashier name by ID
  const getCashierName = (cashierId) => {
    if (!cashierId) return '';
    const cashier = cashiers.find(c => c.id === parseInt(cashierId));
    return cashier ? cashier.name : '';
  };
  
  // transaction functions
  const processTransaction = async () => {
    if (cart.length === 0) {
      alert('Keranjang kosong!');
      return;
    }
    
    if (!selectedCashierId) {
      alert('Pilih nama kasir');
      return;
    }
    
    // use customer name or default
    const finalCustomerName = customerName.trim() || "KONSUMEN BENGKEL";
    
    // generate sales number
    const newSalesNumber = utils.generateSalesNumber();
    setSalesNumber(newSalesNumber);
    
    // generate printed info
    const printedByInfo = `${getCashierName(selectedCashierId)}, ${utils.formatPrintedDate()}`;
    setPrintedInfo(printedByInfo);
    
    try {
      // create transaction payload for api
      const transactionData = {
        sales_number: newSalesNumber,
        cashier_id: parseInt(selectedCashierId),
        customer_name: finalCustomerName,
        customer_phone: customerPhone,
        subtotal,
        discount: totalDiscount,
        total,
        notes: notes,
        printed_by: printedByInfo,
        cart: cart.map(item => ({
            ...item,
        })),
      };
      
      // send transaction to api
      const result = await apiService.createTransaction(transactionData);
      
      // create transaction object for receipt using api response and our utility
      const transaction = {
        id: result.transaction.id,
        sales_number: newSalesNumber,
        transaction_date: result.transaction.created_at || new Date().toISOString(),
        customer_name: finalCustomerName,
        customer_phone: customerPhone,
        cashier_name: getCashierName(selectedCashierId),
        subtotal,
        discount: totalDiscount,
        total_amount: total,
        notes: notes,
        printed_by: printedByInfo
      };
      
      // use prepareReceiptData utility to format transaction data
      const { receiptTransaction } = prepareReceiptData(transaction, cart);
      
      // set current transaction for receipt
      setCurrentTransaction(receiptTransaction);
      setShowReceipt(true);
    } catch (error) {
      alert(`transaction error: ${error.message}`);
      console.error('transaction error:', error);
    }
  };

  // reset transaction
  const resetTransaction = () => {
    setSelectedCashierId('');
    setCustomerName('');
    setCustomerPhone('');
    setCart([]);
    setShowReceipt(false);
    setCurrentTransaction(null);
    setNotes('');
    setSalesNumber('');
    setPrintedInfo('');
  };
  
  // render loading state
  if (isLoading) {
    return (
      <div className={`w-full ${colors.appBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto" />
          <p className="mt-4">loading data...</p>
        </div>
      </div>
    );
  }
  
  // render error state
  if (error) {
    return (
      <div className={`w-full ${colors.appBg} ${colors.textColor} min-h-screen flex items-center justify-center`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md w-full">
          <strong className="font-bold">error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => window.location.reload()}
          >
            try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${colors.pageBg}`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        {showReceipt ? (
          <Receipt 
            receiptRef={receiptRef}
            currentTransaction={currentTransaction}
            cart={cart}
            utils={utils}
            printReceipt={() => printReceipt(receiptRef)}
            resetTransaction={resetTransaction}
            colors={colors}
          />
        ) : (
          <TransactionForm
            products={products}
            cashiers={cashiers}
            colors={colors}
            utils={utils}
            cartFunctions={cartFunctions}
            cart={cart}
            selectedCashierId={selectedCashierId}
            setSelectedCashierId={setSelectedCashierId}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            notes={notes}
            setNotes={setNotes}
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            total={total}
            processTransaction={processTransaction}
            resetTransaction={resetTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default POSSystem;
