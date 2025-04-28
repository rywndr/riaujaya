import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';

const ProductSearch = ({ products, colors, utils, cartFunctions }) => {
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
    <div className={`${colors.cardBg} rounded-xl shadow-lg p-6 ${colors.textColor}`}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Products</h2>
        
        <SearchBar 
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          setSearchTerm={setSearchTerm}
          colors={colors}
        />
      </div>
      
      {/* selected product display */}
      {selectedProduct && (
        <SelectedProductCard 
          selectedProduct={selectedProduct}
          utils={utils}
          handleAddToCart={handleAddToCart}
          colors={colors}
        />
      )}
      
      {/* product grid */}
      <ProductGrid 
        filteredProducts={filteredProducts}
        handleProductSelect={handleProductSelect}
        utils={utils}
        colors={colors}
      />
    </div>
  );
};

// search bar component
const SearchBar = ({ searchTerm, handleSearchChange, setSearchTerm, colors }) => (
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
);

// selected product card
const SelectedProductCard = ({ selectedProduct, utils, handleAddToCart, colors }) => (
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
);

// product grid
const ProductGrid = ({ filteredProducts, handleProductSelect, utils, colors }) => (
  <>
    <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-1">
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
  </>
);

export default ProductSearch;
