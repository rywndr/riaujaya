// calc discount 
export const calculateDiscountAmount = (quantity, unitPrice, discountPercentage) => {
  return (discountPercentage / 100) * (quantity * unitPrice);
};

// calc total price after discount
export const calculateTotalPrice = (quantity, unitPrice, discountPercentage) => {
  const discountAmount = calculateDiscountAmount(quantity, unitPrice, discountPercentage);
  return (quantity * unitPrice) - discountAmount;
};
