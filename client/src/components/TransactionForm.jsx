import React, { useState } from 'react';
import { ShoppingCart, Search, Trash2, Plus, Minus, X } from 'lucide-react';

const TransactionForm = ({
  products,
  cashiers,
  colors,
  utils,
  cartFunctions,
  cart,
  selectedCashierId,
  setSelectedCashierId,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  notes,
  setNotes,
  subtotal,
  totalDiscount,
  total,
  processTransaction,
  resetTransaction
}) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // filter products based on search term
  const filteredProducts = searchTerm.trim() === '' 
    ? products 
    : products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedProduct(null);
  };
  
  // handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm('');
  };
  
  // handle adding product to cart
  const handleAddToCart = () => {
    if (selectedProduct) {
      cartFunctions.addToCart(selectedProduct);
      setSelectedProduct(null);
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* transaction details section (left side) */}
      <div className={`col-span-4 ${colors.cardBg} rounded-xl shadow-lg p-6 h-fit sticky top-4 ${colors.textColor}`}>
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          Transaction Details
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-sm">Sales Representative:</label>
            <select
              value={selectedCashierId}
              onChange={(e) => setSelectedCashierId(e.target.value)}
              className={`border ${colors.inputBorder} rounded-lg p-3 w-full ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200`}
            >
              <option value="">-- Select active sales --</option>
              {cashiers.map(cashier => (
                <option key={cashier.id} value={cashier.id}>
                  {cashier.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-sm">Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={`border ${colors.inputBorder} rounded-lg p-3 w-full ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200`}
              placeholder="Workshop customer"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-sm">Phone Number:</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className={`border ${colors.inputBorder} rounded-lg p-3 w-full ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200`}
              placeholder="Customer phone number"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-sm">Additional Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`border ${colors.inputBorder} rounded-lg p-3 w-full h-32 ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200 resize-none`}
              placeholder="Add notes (optional)"
            ></textarea>
          </div>
        </div>

        {/* process and reset buttons on left side */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
             onClick={resetTransaction}
             className={`${colors.buttonSecondary} py-2 px-1 rounded-lg font-medium text-md ${colors.textColor} transition-all duration-200 hover:opacity-90 flex items-center justify-center`}
          >
              Reset
          </button>

          <button
            onClick={processTransaction}
            className={`${colors.buttonPrimary} py-1 px-2 rounded-lg font-medium text-md transition-all duration-200 hover:opacity-90 flex items-center justify-center`}
            disabled={cart.length === 0}
          >
            Process Transaction
          </button>
          
        </div>
      </div>
      
      {/* right side container */}
      <div className="col-span-8 space-y-6">
        {/* product search and list section (right top row) */}
        <div className={`${colors.cardBg} rounded-xl shadow-lg p-6 ${colors.textColor}`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Products</h2>
            
            <div className="relative">
              <div className="flex items-center">
                <div className="relative flex w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className={`pl-10 pr-12 py-2.5 border ${colors.inputBorder} rounded-full w-full ${colors.inputBg} ${colors.textColor} focus:ring-2 focus:ring-blue-300 outline-none transition duration-200`}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="search by name/code"
                  />
                  {searchTerm && (
                    <button
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 rounded-r-full transition-colors"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* selected product display */}
          {selectedProduct && (
            <div className={`mb-5 p-4 border rounded-lg ${colors.border} ${colors.highlightBg} transition-all duration-200`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                  <p className="text-sm opacity-75">code {selectedProduct.code}</p>
                  <p className="text-md font-semibold mt-1">Price: {utils.formatCurrency(selectedProduct.unit_price)}</p>
                </div>
                <button
                  className={`${colors.buttonPrimary} py-2 px-6 rounded-lg h-10 transition-all duration-200 hover:opacity-90`}
                  onClick={handleAddToCart}
                >
                  <div className="flex items-center space-x-1">
                    <Plus size={16} />
                    <span>Add</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* product grid */}
          <div className="grid grid-cols-3 gap-4 max-h-52 overflow-y-auto pr-1">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className={`border ${colors.border} rounded-lg p-4 cursor-pointer ${colors.productBg} transition-all duration-200 hover:shadow-md`}
                onClick={() => handleProductSelect(product)}
              >
                <div className="font-medium">{product.name}</div>
                <p className="text-xs opacity-60 mt-1">code {product.code}</p>
                <div className="font-bold text-blue-600 mt-2">{utils.formatCurrency(product.unit_price)}</div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 opacity-60">
              <p>No products found matching your search</p>
            </div>
          )}
        </div>
        
        {/* cart section (right bottom) */}
        <div className={`${colors.cardBg} rounded-xl shadow-lg p-6 ${colors.textColor}`}>
          <h2 className="text-xl font-semibold mb-5 flex items-center">
            <ShoppingCart className="mr-2" size={20} />
            Cart
            {cart.length > 0 && (
              <span className="ml-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {cart.length}
              </span>
            )}
          </h2>
          
          {cart.length === 0 ? (
            <div className={`${colors.textMuted} text-center py-12 flex flex-col items-center`}>
              <ShoppingCart size={48} className="opacity-30 mb-4" />
              <p className="text-lg">Cart is empty</p>
              <p className="text-sm mt-2 opacity-75">Select products to start a new transaction</p>
            </div>
          ) : (
            <div>
              <div className="overflow-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <table className="w-full mb-4" style={{ tableLayout: 'fixed' }}>
                  <thead className={`${colors.tableBg} sticky top-0 z-10`}>
                    <tr className={`border-b ${colors.border}`}>
                      <th className="text-left py-3 px-3 w-[30%]">Item</th>
                      <th className="text-right px-3 w-[15%]">Price</th>
                      <th className="text-center px-3 w-[20%]">Qty</th>
                      <th className="text-center px-3 w-[15%]">Disc%</th>
                      <th className="text-right px-3 w-[15%]">Total</th>
                      <th className="px-3 w-[5%]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.product_id} className={`border-b ${colors.border} hover:bg-gray-50`}>
                        <td className="py-4 px-3">{item.product_name}</td>
                        <td className="text-right px-3 font-mono">{utils.formatCurrency(item.unit_price)}</td>
                        <td className="text-center px-3">
                          <div className="flex items-center justify-center">
                            <button 
                              className={`p-1 ${colors.tableBg} rounded-l-lg border ${colors.border} hover:bg-gray-200 transition-colors`}
                              onClick={() => cartFunctions.updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className={`px-3 py-1 ${colors.inputBg} border-t border-b ${colors.border}`}>{item.quantity}</span>
                            <button 
                              className={`p-1 ${colors.tableBg} rounded-r-lg border ${colors.border} hover:bg-gray-200 transition-colors`}
                              onClick={() => cartFunctions.updateQuantity(item.product_id, item.quantity + 1)}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="text-center px-3">
                          <input
                            type="number"
                            value={item.discount_percentage}
                            onChange={(e) => {
                              // prevent nan by parsing as float and defaulting to 0
                              const value = parseFloat(e.target.value) || 0;
                              cartFunctions.updateDiscount(item.product_id, value);
                            }}
                            className={`border ${colors.inputBorder} rounded-lg w-16 p-1 text-right ${colors.inputBg} ${colors.textColor}`}
                            min="0"
                            max="100"
                            step="0.01"
                          />
                        </td>
                        <td className="text-right px-3 font-mono">{utils.formatCurrency(item.total_price)}</td>
                        <td className="text-right px-3">
                          <button 
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                            onClick={() => cartFunctions.removeFromCart(item.product_id)}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className={`border-t ${colors.border} pt-5 mt-3`}>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-mono w-32 text-right">{utils.formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span>Total Discount:</span>
                  <span className="font-mono w-32 text-right">{utils.formatCurrency(totalDiscount)}</span>
                </div>
                
                <div className="flex justify-between font-bold text-lg mb-2 mt-3 pt-3 border-t">
                  <span>Total:</span>
                  <span className="font-mono w-32 text-right">{utils.formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
