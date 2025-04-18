import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';

const initializeDatabase = () => {
  // predefined cashiers
  const cashiers = [
    { id: 1, name: 'Haikhal Roywendra' },
    { id: 2, name: 'Maria Febrianti' },
    { id: 3, name: 'John Doe' }
  ];

  // mock customers table - now we'll just store recent customers for history
  const customers = [];

  // mock products table with actual suzuki motorcycle products in bahasa
  const products = [
    { id: 1, name: 'Oli Mesin SGO Suzuki', unit_price: 75000, code: '9900079992101' },
    { id: 2, name: 'Filter Udara Satria FU', unit_price: 45000, code: '9900079992102' },
    { id: 3, name: 'Busi Iridium GSX-R150', unit_price: 120000, code: '9900079992103' },
    { id: 4, name: 'Kampas Rem Depan Nex', unit_price: 60000, code: '9900079992104' },
    { id: 5, name: 'Oli Gardan Suzuki', unit_price: 35000, code: '9900079992105' }
  ];

  // mock transactions table (initially empty)
  const transactions = [];

  // mock transaction_items table (initially empty)
  const transaction_items = [];

  return { cashiers, customers, products, transactions, transaction_items };
};

const db = initializeDatabase();

// generate sales number function
const generateSalesNumber = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const year = new Date().getFullYear();
  return `${randomNum}/RJC/${month}/${year}`;
};

// format date for printing
const formatPrintedDate = () => {
  const now = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const time = `${hours}:${minutes}:${seconds}`;
  
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  return `${time}, ${day}, ${date} ${month} ${year}`;
};

const POSSystem = () => {
  const [cashiers] = useState(db.cashiers);
  const [products] = useState(db.products);
  const [selectedCashierId, setSelectedCashierId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [notes, setNotes] = useState('');
  const [salesNumber, setSalesNumber] = useState('');
  const [printedInfo, setPrintedInfo] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
  // Reference to the receipt element for printing
  const receiptRef = useRef(null);
  
  // calculate subtotal from cart items (considering per-item discounts)
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  
  // calculate total discount amount
  const totalDiscount = cart.reduce((sum, item) => {
    const discountAmount = (item.discount_percentage / 100) * (item.quantity * item.unit_price);
    return sum + discountAmount;
  }, 0);
  
  // calculate total after all discounts
  const total = subtotal - totalDiscount;
  
  // add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      // increase quantity if product already in cart
      const updatedCart = cart.map(item => {
        if (item.product_id === product.id) {
          const quantity = item.quantity + 1;
          const discountAmount = (item.discount_percentage / 100) * (quantity * product.unit_price);
          const total_price = (quantity * product.unit_price) - discountAmount;
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
  };
  
  // remove product from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };
  
  // update product quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => {
      if (item.product_id === productId) {
        const discountAmount = (item.discount_percentage / 100) * (newQuantity * item.unit_price);
        const total_price = (newQuantity * item.unit_price) - discountAmount;
        return { ...item, quantity: newQuantity, total_price };
      }
      return item;
    });
    
    setCart(updatedCart);
  };
  
  // update discount percentage for an item
  const updateDiscount = (productId, discountPercentage) => {
    // ensure discount is between 0 and 100
    const validDiscount = Math.max(0, Math.min(100, discountPercentage));
    
    const updatedCart = cart.map(item => {
      if (item.product_id === productId) {
        const discountAmount = (validDiscount / 100) * (item.quantity * item.unit_price);
        const total_price = (item.quantity * item.unit_price) - discountAmount;
        return { ...item, discount_percentage: validDiscount, total_price };
      }
      return item;
    });
    
    setCart(updatedCart);
  };

  // get cashier name by ID
  const getCashierName = (cashierId) => {
    if (!cashierId) return '';
    const cashier = cashiers.find(c => c.id === parseInt(cashierId));
    return cashier ? cashier.name : '';
  };
  
  // process transaction
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
    const newSalesNumber = generateSalesNumber();
    setSalesNumber(newSalesNumber);
    
    // generate printed info
    const printedByInfo = `Dicetak oleh: ${getCashierName(selectedCashierId)}, ${formatPrintedDate()}`;
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

  // print receipt function - optimized to only print the receipt
  const printReceipt = () => {
    if (!receiptRef.current) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'height=600,width=800');
    
    // Get styles
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // Ignore errors with cross-origin stylesheets
          return '';
        }
      })
      .join('\n');
    
    // Get receipt content
    const receiptContent = receiptRef.current.innerHTML;
    
    // Create print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>PT.RIAUJAYA CEMERLANG SUZUKI - Receipt</title>
          <style>${styles}</style>
          <style>
            @media print {
              body { 
                padding: 0; 
                margin: 0;
                background-color: white !important;
                color: black !important;
              }
              .no-print { display: none !important; }
            }
            body {
              font-family: Arial, sans-serif;
              background-color: white;
              color: black;
            }
          </style>
        </head>
        <body class="bg-white text-black">
          <div class="receipt-content">
            ${receiptContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 500);
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    
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
  
  // format price as IDR currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // format discount percentage
  const formatDiscount = (percentage) => {
    return `${percentage.toFixed(2)}%`;
  };
  
  // toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Set up dark mode effect
  useEffect(() => {
    // Add or remove dark mode class from body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Generate dynamic color classes based on dark mode
  const getColorClasses = () => {
    return {
      appBg: darkMode ? 'bg-gray-900' : 'bg-gray-100',
      cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
      textColor: darkMode ? 'text-white' : 'text-black',
      textMuted: darkMode ? 'text-gray-300' : 'text-gray-500',
      border: darkMode ? 'border-gray-700' : 'border-gray-200',
      tableBg: darkMode ? 'bg-gray-700' : 'bg-gray-50',
      tableHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-blue-50',
      inputBg: darkMode ? 'bg-gray-700' : 'bg-white',
      inputBorder: darkMode ? 'border-gray-600' : 'border-gray-300',
      buttonPrimary: 'bg-blue-600 text-white hover:bg-blue-700',
      buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
      productBg: darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
    };
  };
  
  const colors = getColorClasses();
  
  return (
    <div className={`w-full min-h-screen ${colors.appBg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${colors.textColor}`}>PT.RIAUJAYA CEMERLANG SUZUKI</h1>
          
          {/* Dark Mode Toggle */}
          <button
              onClick={toggleDarkMode}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              }`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Moon className="text-white" size={20} />
              ) : (
                <Sun className="text-gray-900" size={20} />
              )}
            </button>
        </div>
        
        {!showReceipt ? (
          <div className="grid grid-cols-12 gap-6">
            <div className={`col-span-5 ${colors.cardBg} rounded-lg shadow p-4 ${colors.textColor}`}>
              <h2 className="text-xl font-semibold mb-4">Produk</h2>
              <div className="grid grid-cols-2 gap-3">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    className={`border ${colors.border} rounded-md p-3 cursor-pointer ${colors.productBg} transition-colors`}
                    onClick={() => addToCart(product)}
                  >
                    <div className="font-medium">{product.name}</div>
                    <div className="font-bold text-blue-600">{formatCurrency(product.unit_price)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Detail Transaksi</h2>
                
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Nama Kasir:</label>
                  <select
                    value={selectedCashierId}
                    onChange={(e) => setSelectedCashierId(e.target.value)}
                    className={`border ${colors.inputBorder} rounded p-2 w-full ${colors.inputBg} ${colors.textColor}`}
                  >
                    <option value="">-- Pilih Kasir --</option>
                    {cashiers.map(cashier => (
                      <option key={cashier.id} value={cashier.id}>
                        {cashier.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Nama Pelanggan:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`border ${colors.inputBorder} rounded p-2 w-full ${colors.inputBg} ${colors.textColor}`}
                    placeholder="KONSUMEN BENGKEL"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Nomor Telepon:</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`border ${colors.inputBorder} rounded p-2 w-full ${colors.inputBg} ${colors.textColor}`}
                    placeholder="Nomor telepon pelanggan"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Catatan:</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`border ${colors.inputBorder} rounded p-2 w-full h-24 ${colors.inputBg} ${colors.textColor}`}
                    placeholder="Tambahkan catatan (opsional)"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className={`col-span-7 ${colors.cardBg} rounded-lg shadow p-4 ${colors.textColor}`}>
              <h2 className="text-xl font-semibold mb-4">Keranjang</h2>
              {cart.length === 0 ? (
                <div className={`${colors.textMuted} text-center py-12`}>
                  <p className="text-lg">Keranjang masih kosong</p>
                  <p className="text-sm mt-2">Pilih produk untuk memulai transaksi</p>
                </div>
              ) : (
                <div>
                  <div className="overflow-auto max-h-96">
                    <table className="w-full mb-4">
                      <thead className={colors.tableBg}>
                        <tr className={`border-b ${colors.border}`}>
                          <th className="text-left py-2 px-2">Item</th>
                          <th className="text-right px-2">Harga</th>
                          <th className="text-center px-2">Jumlah</th>
                          <th className="text-center px-2">Disc %</th>
                          <th className="text-right px-2">Total</th>
                          <th className="px-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item.product_id} className={`border-b ${colors.border}`}>
                            <td className="py-3 px-2">{item.product_name}</td>
                            <td className="text-right px-2">{formatCurrency(item.unit_price)}</td>
                            <td className="text-center px-2">
                              <div className="flex items-center justify-center">
                                <button 
                                  className={`px-2 ${colors.tableBg} rounded-l`}
                                  onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                >-</button>
                                <span className={`px-3 py-1 ${colors.inputBg}`}>{item.quantity}</span>
                                <button 
                                  className={`px-2 ${colors.tableBg} rounded-r`}
                                  onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                >+</button>
                              </div>
                            </td>
                            <td className="text-center px-2">
                              <input
                                type="number"
                                value={item.discount_percentage}
                                onChange={(e) => updateDiscount(item.product_id, Number(e.target.value))}
                                className={`border ${colors.inputBorder} rounded w-16 p-1 text-right ${colors.inputBg} ${colors.textColor}`}
                                min="0"
                                max="100"
                                step="0.01"
                              />
                            </td>
                            <td className="text-right px-2">{formatCurrency(item.total_price)}</td>
                            <td className="text-right px-2">
                              <button 
                                className="text-red-500 hover:bg-red-50 p-1 rounded"
                                onClick={() => removeFromCart(item.product_id)}
                              >✕</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={`border-t ${colors.border} pt-4 mt-4`}>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span>Total Diskon:</span>
                      <span>{formatCurrency(totalDiscount)}</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg mb-6">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={processTransaction}
                        className={`${colors.buttonPrimary} py-3 px-4 rounded-lg font-medium text-lg`}
                        disabled={cart.length === 0}
                      >
                        Proses Transaksi
                      </button>
                      
                      <button
                        onClick={resetTransaction}
                        className={`${colors.buttonSecondary} py-3 px-4 rounded-lg font-medium text-lg ${colors.textColor}`}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* centered receipt - always white background for printing */}
            <div ref={receiptRef} className="bg-white text-black border rounded-lg shadow-lg p-8 mb-4 w-3/4 mx-auto">
              {/* new receipt layout */}
              <div className="flex mb-8">
                <div className="w-1/2">
                  <div className="text-2xl font-bold">PT.RIAUJAYA CEMERLANG</div>
                  <div className="text-sm">JL. NANGKA/TUANKU TAMBUSAI Blok - No.18 J.K.L RT:000 RW:000</div>
                  <div className="text-sm">Kel.TAMPAN Kec.PAYUNG SEKAKI Kota/Kab.PE</div>
                  <div className="mt-4">
                    <div><strong>SALES NO:</strong> {currentTransaction.sales_number}</div>
                    <div><strong>TANGGAL:</strong> {new Date(currentTransaction.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
                
                {/* customer info with better alignment */}
                <div className="w-1/2 pl-24">
                  <div className="mt-3">
                    <div><strong>Kepada:</strong> {currentTransaction.customer_name}</div>
                    <div className="ml-16">TANJUNGPINANG</div>
                    <div>&nbsp;</div>
                    <div><strong>Telepon:</strong> {currentTransaction.customer_phone}</div>
                    <div><strong>Sales:</strong> {currentTransaction.cashier_name}</div>
                  </div>
                </div>
              </div>
              
              {/* table spans full width */}
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b border-t">
                    <th className="text-center py-1 w-8">NO</th>
                    <th className="text-left">KODE BARANG</th>
                    <th className="text-left">NAMA BARANG</th>
                    <th className="text-right">JUMLAH</th>
                    <th className="text-right">BONUS</th>
                    <th className="text-right">@HARGA</th>
                    <th className="text-right">HARGA</th>
                    <th className="text-right">DISCOUNT</th>
                    <th className="text-right">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => {
                    const discountAmount = (item.discount_percentage / 100) * (item.quantity * item.unit_price);
                    return (
                      <tr key={item.product_id} className="border-b">
                        <td className="text-center">{index + 1}</td>
                        <td>{item.product_code}</td>
                        <td>{item.product_name}</td>
                        <td className="text-right">{item.quantity} PCS</td>
                        <td className="text-right"></td>
                        <td className="text-right">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right">{formatCurrency(item.unit_price)}</td>
                        <td className="text-right">{formatDiscount(item.discount_percentage)}</td>
                        <td className="text-right">{formatCurrency(item.total_price)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* section with notes on left, totals and signatures on right */}
              <div className="flex">
                {/* notes and printed by */}
                <div className="w-1/2">
                  <div className="mb-4">
                    <p className="font-semibold">Catatan:</p>
                    <p className="whitespace-pre-line">{currentTransaction.notes || "-"}</p>
                  </div>
                  <div>
                    <p>{currentTransaction.printed_by}</p>
                  </div>
                  
                  <div className="mt-48 mb-4">
                    <div className="w-1/2 text-center">
                      <p className="mt-2">Yang Menerima.</p>
                      <div className="border-b pb-16"></div>
                    </div>
                  </div>
                </div>

                {/* totals and signature fields */}
                <div className="w-1/2 text-right">
                  <div className="flex justify-end mb-1">
                    <span className="w-28 text-left">TOTAL:</span>
                    <span className="w-32 pl-4 text-left">
                    {`IDR ${currentTransaction.subtotal.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-end mb-1">
                    <span className="w-28 text-left">DISCOUNT:</span>
                      <span className="w-32 pl-4 text-left">
                        {currentTransaction.discount > 0
                          ? `IDR ${currentTransaction.discount.toLocaleString('id-ID')}`
                          : 'IDR '}
                      </span>
                  </div>
                  
                  <div className="w-61 ml-auto border-t mt-2 pt-2"></div>
                  
                  <div className="flex justify-end font-bold mb-8">
                    <span className="w-48">GRAND TOTAL:</span>
                    <span className="w-32 pl-4 text-left">
                      {`IDR ${currentTransaction.total.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  
                  {/* signature fields below grand total */}
                  <div className="flex mt-48 mb-2 justify-end">
                    <div className="flex w-full">
                      <div className="w-1/2 text-center pr-2">
                        <p>Yang Menyetujui.</p>
                        <div className="border-b pb-16"></div>
                      </div>
                      <div className="w-1/2 text-center pl-2">
                        <p>Yang Membuat.</p>
                        <div className="border-b pb-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* buttons - use dark mode colors if enabled */}
            <div className="flex justify-center space-x-4 w-3/4">
              <button
                onClick={printReceipt}
                className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 font-medium"
              >
                Cetak Struk
              </button>
              
              <button
                onClick={resetTransaction}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-medium"
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POSSystem;
