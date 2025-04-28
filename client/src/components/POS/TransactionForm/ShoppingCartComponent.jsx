import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

const ShoppingCartComponent = ({ cart, colors, utils, cartFunctions, subtotal, totalDiscount, total }) => {
  return (
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
        <EmptyCartDisplay colors={colors} />
      ) : (
        <CartWithItems 
          cart={cart}
          colors={colors}
          utils={utils}
          cartFunctions={cartFunctions}
          subtotal={subtotal}
          totalDiscount={totalDiscount}
          total={total}
        />
      )}
    </div>
  );
};

// empty cart display
const EmptyCartDisplay = ({ colors }) => (
  <div className={`${colors.textMuted} text-center py-12 flex flex-col items-center`}>
    <ShoppingCart size={48} className="opacity-30 mb-4" />
    <p className="text-lg">Cart is empty</p>
    <p className="text-sm mt-2 opacity-75">Select products to start a new transaction</p>
  </div>
);

// cart with items
const CartWithItems = ({ cart, colors, utils, cartFunctions, subtotal, totalDiscount, total }) => (
  <div>
    <div className="overflow-auto max-h-96 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <table className="w-full mb-4" style={{ tableLayout: 'fixed' }}>
        <CartTableHeader colors={colors} />
        <tbody>
          {cart.map(item => (
            <CartItem
              key={item.product_id}
              item={item}
              colors={colors}
              utils={utils}
              cartFunctions={cartFunctions}
            />
          ))}
        </tbody>
      </table>
    </div>
    
    <CartSummary 
      subtotal={subtotal}
      totalDiscount={totalDiscount}
      total={total}
      utils={utils}
      colors={colors}
    />
  </div>
);

// cart table header
const CartTableHeader = ({ colors }) => (
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
);

// cart item
const CartItem = ({ item, colors, utils, cartFunctions }) => (
  <tr className={`border-b ${colors.border} ${colors.tableText} ${colors.tableHover}`}>
    <td className="py-4 px-3">{item.product_name}</td>
    <td className="text-right px-3 font-mono">{utils.formatCurrency(item.unit_price)}</td>
    <td className="text-center px-3">
      <QuantityControl 
        item={item}
        colors={colors}
        cartFunctions={cartFunctions}
      />
    </td>
    <td className="text-center px-3">
      <DiscountInput 
        item={item}
        colors={colors}
        cartFunctions={cartFunctions}
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
);

// qty control
const QuantityControl = ({ item, colors, cartFunctions }) => (
  <div className="flex items-center justify-center">
    <button 
      className={`p-2 ${colors.tableBg} rounded-l-lg border ${colors.border} hover:bg-gray-200 transition-colors`}
      onClick={() => cartFunctions.updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
      disabled={item.quantity <= 1}
    >
      <Minus size={16} />
    </button>
    <span className={`px-3 py-2 ${colors.inputBg} border-t border-b ${colors.border}`}>{item.quantity}</span>
    <button 
      className={`p-2 ${colors.tableBg} rounded-r-lg border ${colors.border} hover:bg-gray-200 transition-colors`}
      onClick={() => cartFunctions.updateQuantity(item.product_id, item.quantity + 1)}
    >
      <Plus size={16} />
    </button>
  </div>
);

// discount input
const DiscountInput = ({ item, colors, cartFunctions }) => (
  <input
    type="number"
    value={item.discount_percentage}
    onChange={(e) => {
      // prevent nan by parsing as float and defaulting to 0
      const value = parseFloat(e.target.value) || 0;
      cartFunctions.updateDiscount(item.product_id, value);
    }}
    className={`border ${colors.inputBorder} rounded-lg w-16 p-1 text-right ${colors.inputBg} ${colors.textColor} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
    min="0"
    max="100"
    step="0.01"
  />
);

// cart summary
const CartSummary = ({ subtotal, totalDiscount, total, utils, colors }) => (
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
);

export default ShoppingCartComponent;
