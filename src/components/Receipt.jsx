import React from 'react';

const Receipt = ({ 
  receiptRef, 
  currentTransaction, 
  cart, 
  utils, 
  printReceipt, 
  resetTransaction 
}) => {
  if (!currentTransaction) return null;
  
  // destructure formatting utilities from utils
  const { formatCurrency, formatDiscount } = utils;
  
  return (
    <div className="flex flex-col items-center">
      <div ref={receiptRef} className="bg-white text-black border rounded-lg shadow-lg p-8 mb-4 w-full mx-auto">
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
          
          {/* customer info */}
          <div className="w-1/2 pl-12">
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
        <div className="overflow-x-auto">
          <table className="w-full mb-4 table-fixed">
            <thead>
              <tr className="border-b border-t">
                <th className="text-center py-1 w-10">NO</th>
                <th className="text-left w-24">KODE</th>
                <th className="text-left w-48">NAMA BARANG</th>
                <th className="text-right w-16">JUMLAH</th>
                <th className="text-right w-16">BONUS</th>
                <th className="text-right w-20">@HARGA</th>
                <th className="text-right w-24">HARGA</th>
                <th className="text-right w-20">DISCOUNT</th>
                <th className="text-right w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => {
                const discountAmount = (item.discount_percentage / 100) * (item.quantity * item.unit_price);
                return (
                  <tr key={item.product_id} className="border-b">
                    <td className="text-center">{index + 1}</td>
                    <td className="truncate">{item.product_code}</td>
                    <td className="truncate">{item.product_name}</td>
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
        </div>
        
        {/* section notes on left, totals and signatures on right */}
        <div className="flex flex-wrap">
          {/* notes and printed by */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <p className="font-semibold">Catatan:</p>
              <p className="whitespace-pre-line">{currentTransaction.notes || "-"}</p>
            </div>
            <div>
              <p>{currentTransaction.printed_by}</p>
            </div>
            
            <div className="mt-32 mb-4">
              <div className="w-1/2 text-center">
                <p className="mt-2">Yang Menerima.</p>
                <div className="border-b pb-16"></div>
              </div>
            </div>
          </div>

          {/* totals and signature fields */}
          <div className="w-full md:w-1/2 text-right">
            <div className="flex justify-end mb-1">
              <span className="w-28 text-left">TOTAL:</span>
              <span className="w-36 pl-4 text-left">
                {`IDR ${currentTransaction.subtotal.toLocaleString('id-ID')}`}
              </span>
            </div>
            
            <div className="flex justify-end mb-1">
              <span className="w-28 text-left">DISCOUNT:</span>
              <span className="w-36 pl-4 text-left">
                {currentTransaction.discount > 0
                  ? `IDR ${currentTransaction.discount.toLocaleString('id-ID')}`
                  : 'IDR '}
              </span>
            </div>
            
            <div className="w-64 ml-auto border-t mt-2 pt-2"></div>
            
            <div className="flex justify-end font-bold mb-8">
              <span className="w-28 text-left">GRAND TOTAL:</span>
              <span className="w-36 pl-4 text-left">
                {`IDR ${currentTransaction.total.toLocaleString('id-ID')}`}
              </span>
            </div>
            
            {/* signature fields below grand total */}
            <div className="flex mt-32 mb-2 justify-end">
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
      
      <div className="flex justify-center space-x-4 w-full md:w-3/4">
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
  );
};

export default Receipt;
