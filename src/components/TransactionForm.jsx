import React from 'react';

const TransactionForm = ({ 
  db, 
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
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* products and transaction details section */}
      <div className={`col-span-5 ${colors.cardBg} rounded-lg shadow p-4 ${colors.textColor}`}>
        <h2 className="text-xl font-semibold mb-4">Produk</h2>
        <div className="grid grid-cols-2 gap-3">
          {db.products.map(product => (
            <div 
              key={product.id} 
              className={`border ${colors.border} rounded-md p-3 cursor-pointer ${colors.productBg} transition-colors`}
              onClick={() => cartFunctions.addToCart(product)}
            >
              <div className="font-medium">{product.name}</div>
              <div className="font-bold text-blue-600">{utils.formatCurrency(product.unit_price)}</div>
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
              {db.cashiers.map(cashier => (
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
      
      {/* cart section */}
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
              <table className="w-full mb-4" style={{ tableLayout: 'fixed' }}>
                <thead className={colors.tableBg}>
                  <tr className={`border-b ${colors.border}`}>
                    <th className="text-left py-2 px-2 w-[30%]">Item</th>
                    <th className="text-right px-2 w-[15%]">Harga</th>
                    <th className="text-center px-2 w-[20%]">Jumlah</th>
                    <th className="text-center px-2 w-[15%]">Disc %</th>
                    <th className="text-right px-2 w-[15%]">Total</th>
                    <th className="px-2 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.product_id} className={`border-b ${colors.border}`}>
                      <td className="py-3 px-2">{item.product_name}</td>
                      <td className="text-right px-2 font-mono">{utils.formatCurrency(item.unit_price)}</td>
                      <td className="text-center px-2">
                        <div className="flex items-center justify-center">
                          <button 
                            className={`px-2 py-1 ${colors.tableBg} rounded-l`}
                            onClick={() => cartFunctions.updateQuantity(item.product_id, item.quantity - 1)}
                          >-</button>
                          <span className={`px-3 py-1 ${colors.inputBg}`}>{item.quantity}</span>
                          <button 
                            className={`px-2 py-1 ${colors.tableBg} rounded-r`}
                            onClick={() => cartFunctions.updateQuantity(item.product_id, item.quantity + 1)}
                          >+</button>
                        </div>
                      </td>
                      <td className="text-center px-2">
                        <input
                          type="text"
                          value={item.discount_percentage}
                          onChange={(e) => cartFunctions.updateDiscount(item.product_id, Number(e.target.value))}
                          className={`border ${colors.inputBorder} rounded w-16 p-1 text-right ${colors.inputBg} ${colors.textColor}`}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </td>
                      <td className="text-right px-2 font-mono">{utils.formatCurrency(item.total_price)}</td>
                      <td className="text-right px-2">
                        <button 
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                          onClick={() => cartFunctions.removeFromCart(item.product_id)}
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
                <span className="font-mono w-32 text-right">{utils.formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span>Total Diskon:</span>
                <span className="font-mono w-32 text-right">{utils.formatCurrency(totalDiscount)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span className="font-mono w-32 text-right">{utils.formatCurrency(total)}</span>
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
  );
};

export default TransactionForm;
