import { useState, useEffect } from 'react';
import * as calculations from '../utils/calculations';

export const useCart = () => {
  // load cart data from localstorage on initial render
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // save cart to localstorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // calculate subtotal (pre-discount amount)
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  
  // calculate total discount amount
  const totalDiscount = cart.reduce((sum, item) => {
    return sum + calculations.calculateDiscountAmount(item.quantity, item.unit_price, item.discount_percentage);
  }, 0);
  
  // calculate final total
  const total = subtotal - totalDiscount;
  
  // cart management functions
  const cartFunctions = {
    addToCart: (product) => {
      const existingItem = cart.find(item => item.product_id === product.id);
      
      if (existingItem) {
        // if product is in cart, update quantity and total price
        const updatedCart = cart.map(item => {
          if (item.product_id === product.id) {
            const quantity = item.quantity + 1;
            const total_price = calculations.calculateTotalPrice(
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
          const total_price = calculations.calculateTotalPrice(
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
          const total_price = calculations.calculateTotalPrice(
            item.quantity, 
            item.unit_price, 
            validDiscount
          );
          return { ...item, discount_percentage: validDiscount, total_price };
        }
        return item;
      }));
    },
    
    clearCart: () => {
      setCart([]);
    }
  };
  
  return {
    cart,
    cartFunctions,
    subtotal,
    totalDiscount,
    total
  };
};
