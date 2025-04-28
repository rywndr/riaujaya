import React from 'react';

const ReceiptTable = ({ cart, utils, colors }) => {
  // destructure formatting utilities from utils
  const { formatPriceOnly, formatDiscount } = utils;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full mb-4 table-fixed">
        <thead>
          <tr className={`border-b border-t ${colors.border}`}>
            <th className="text-center py-1 w-10">NO</th>
            <th className="text-left w-24">KODE</th>
            <th className="text-left w-48">NAMA BARANG</th>
            <th className="text-right w-16">JUMLAH</th>
            <th className="text-right w-16">BONUS</th>
            <th className="text-right w-20">@HARGA</th>
            <th className="text-right w-20">HARGA</th>
            <th className="text-right w-20">DISCOUNT</th>
            <th className="text-right w-24">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <TableRow 
              key={item.product_id}
              item={item}
              index={index}
              isLastItem={index === cart.length - 1}
              formatPriceOnly={formatPriceOnly}
              formatDiscount={formatDiscount}
              colors={colors}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// table row component to reduce complexity in the parent component
const TableRow = ({ 
  item, 
  index, 
  isLastItem, 
  formatPriceOnly, 
  formatDiscount,
  colors 
}) => (
  <tr className={isLastItem ? `border-b ${colors.border}` : ""}>
    <td className="text-center">{index + 1}</td>
    <td className="truncate">{item.product_code}</td>
    <td className="truncate">{item.product_name}</td>
    <td className="text-right">{item.quantity} PCS</td>
    <td className="text-right"></td>
    <td className="text-right">{formatPriceOnly(item.unit_price)}</td>
    <td className="text-right">{formatPriceOnly(item.unit_price)}</td>
    <td className="text-right">{formatDiscount(item.discount_percentage)}</td>
    <td className="text-right">{formatPriceOnly(item.total_price)}</td>
  </tr>
);

export default ReceiptTable;
