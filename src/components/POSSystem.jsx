import React, { useState, useEffect, useRef } from 'react';
import TransactionForm from './TransactionForm';
import Receipt from './Receipt';
import ProfileDropdown from './ProfileDropdown'; 
import useColorClasses from '../hooks/useColorClasses';
import { useAuth } from '../context/AuthContext';
import db from '../data/database';
import * as formatters from '../utils/formatters';
import * as calculations from '../utils/calculations';

const POSSystem = () => {
  // get auth context for user info and sign out
  const { user, signOut } = useAuth();

  // combine utils into a single object for ease of use
  const utils = {
    ...formatters,
    ...calculations
  };

  // get color classes and dark mode functionality from custom hook
  const { colors, darkMode, toggleDarkMode } = useColorClasses(false);

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
  
  // ref to the receipt element for printing
  const receiptRef = useRef(null);
  
  // calculate subtotal, total discount, and total
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const totalDiscount = cart.reduce((sum, item) => {
    return sum + utils.calculateDiscountAmount(item.quantity, item.unit_price, item.discount_percentage);
  }, 0);
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
    const cashier = db.cashiers.find(c => c.id === parseInt(cashierId));
    return cashier ? cashier.name : '';
  };
  
  // transaction functions
  const processTransaction = () => {
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
    
    // create new transaction
    const newTransaction = {
      id: db.transactions.length + 1,
      sales_number: newSalesNumber,
      transaction_date: new Date().toISOString(),
      customer_name: finalCustomerName,
      customer_phone: customerPhone,
      cashier_name: getCashierName(selectedCashierId),
      subtotal,
      discount: totalDiscount,
      total,
      notes: notes,
      printed_by: printedByInfo
    };
    
    // add transaction to db
    db.transactions.push(newTransaction);
    
    // add transaction items to db
    cart.forEach(item => {
      const newItem = {
        id: db.transaction_items.length + 1,
        transaction_id: newTransaction.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_percentage: item.discount_percentage,
        total_price: item.total_price
      };
      db.transaction_items.push(newItem);
    });
    
    // set current transaction for receipt
    setCurrentTransaction(newTransaction);
    setShowReceipt(true);
  };

  // print receipt function
  const printReceipt = () => {
    if (!receiptRef.current) return;

    // crude but effective mobile check
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // open the print window synchronously on click
    const printWindow = window.open('', '_blank', 'height=600,width=800');

    // grab all CSS
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch {
          // ignore cross‑origin sheets
          return '';
        }
      })
      .join('\n');

    // get receipt HTML
    const receiptContent = receiptRef.current.innerHTML;

    // write the full document with conditional close
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PT.RIAUJAYA CEMERLANG SUZUKI - Receipt</title>
          <style>${styles}</style>
          <style>
            @media print {
              body { padding:0; margin:0; background:#fff!important; color:#000!important; }
              .no-print { display:none!important; }
            }
            body { font-family:Arial, sans-serif; background:#fff; color:#000; }
          </style>
        </head>
        <body class="bg-white text-black"
              onload="
                window.print();
                ${!isMobile ? 'setTimeout(() => window.close(), 500);' : ''}
              ">
          <div class="receipt-content">
            ${receiptContent}
          </div>
        </body>
      </html>
    `);

    // close document so onload will fire
    printWindow.document.close();
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
  
  return (
    <div className={`w-full min-h-screen ${colors.appBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${colors.textColor}`}>PT.RIAUJAYA CEMERLANG SUZUKI</h1>
          
          <ProfileDropdown 
            user={user} 
            signOut={signOut} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode} 
            colors={colors} 
          />
        </div>
        
        {showReceipt ? (
          <Receipt 
            receiptRef={receiptRef}
            currentTransaction={currentTransaction}
            cart={cart}
            utils={utils}
            printReceipt={printReceipt}
            resetTransaction={resetTransaction}
          />
        ) : (
          <TransactionForm
            db={db}
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
