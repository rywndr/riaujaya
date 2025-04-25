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
  const { formatCurrency, formatDiscount, formatPriceOnly } = utils;
  
  return (
    <div className="flex flex-col items-center">
      <div ref={receiptRef} className="bg-white text-black border rounded-lg shadow-lg p-8 mb-4 w-full mx-auto">
        <div className="flex mb-8">
          <div className="w-1/2">
            <div className="text-2xl font-bold">PT.RIAUJAYA CEMERLANG</div>
            <div className="text-sm">JL. NANGKA/TUANKU TAMBUSAI Blok - No.18 J.K.L RT:000 RW:000</div>
            <div className="text-sm">Kel.TAMPAN Kec.PAYUNG SEKAKI Kota/Kab.PE</div>
            <div className="mt-4">
              <div className="flex">
                <span className="w-24 inline-block"><strong>SALES NO</strong></span>
                <span className="inline-block"><strong>:</strong> {currentTransaction.sales_number}</span>
              </div>
              <div className="flex">
                <span className="w-24 inline-block"><strong>TANGGAL</strong></span>
                <span className="inline-block"><strong>:</strong> {new Date(currentTransaction.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          {/* customer info */}
          <div className="w-1/2 pl-48">
            <div className="mt-3">
              <div className="flex">
                <span className="w-24 inline-block"><strong>Kepada</strong></span>
                <span className="inline-block"><strong>:</strong> {currentTransaction.customer_name}</span>
              </div>
              <div className="flex">
                <span className="w-24 inline-block"></span>
                <span className="ml-[10px]">TANJUNGPINANG</span>
              </div>
              <div>&nbsp;</div>
              <div className="flex">
                <span className="w-24 inline-block"><strong>Telepon</strong></span>
                <span className="inline-block"><strong>:</strong> {currentTransaction.customer_phone}</span>
              </div>
              <div className="flex">
                <span className="w-24 inline-block"><strong>Sales</strong></span>
                <span className="inline-block"><strong>:</strong> {currentTransaction.cashier_name}</span>
              </div>
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
                const isLastItem = index === cart.length - 1;
                
                return (
                  <tr key={item.product_id} className={isLastItem ? "border-b" : ""}>
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
              })}
            </tbody>
          </table>
        </div>
        
        {/* section notes on left, totals and signatures on right */}
        <div className="flex flex-wrap">
          {/* notes and printed by */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <div className="flex">
                <span className="w-24 inline-block"><strong>Catatan</strong></span>
                <span className="inline-block"><strong>:</strong> {currentTransaction.notes || ""}</span>
              </div>
            </div>
            <div className="flex">
              <span className="w-24 inline-block"><strong>Printed By</strong></span>
              <span className="inline-block"><strong>:</strong> {currentTransaction.printed_by}</span>
            </div>
          </div>

          {/* totals and signature fields */}
          <div className="w-full md:w-1/2 text-right">
            <div className="flex justify-end mb-1">
              <span className="w-28 text-left">TOTAL</span>
              <span className="w-6 text-center">:</span>
              <span className="w-36 text-left">
                {`IDR ${currentTransaction.subtotal.toLocaleString('id-ID')}`}
              </span>
            </div>
            
            <div className="flex justify-end mb-1">
              <span className="w-28 text-left">DISCOUNT</span>
              <span className="w-6 text-center">:</span>
              <span className="w-36 text-left">
                {currentTransaction.discount > 0
                  ? `IDR ${currentTransaction.discount.toLocaleString('id-ID')}`
                  : 'IDR '}
              </span>
            </div>
            
            <div className="w-64 ml-auto border-t mt-2 pt-2"></div>
            
            <div className="flex justify-end font-bold mb-8">
              <span className="w-28 text-left">GRAND TOTAL</span>
              <span className="w-6 text-center">:</span>
              <span className="w-36 text-left">
                {`IDR ${currentTransaction.total.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex mt-28 w-full">
          <div className="w-1/3 text-center">
            <p>Yang Menerima.</p>
            <div className="h-20"></div>
            <div className="w-32 mx-auto border-b"></div>
          </div>
          
          <div className="w-2/3 flex justify-end">
            <div className="w-1/2 text-center pr-4">
              <p>Yang Menyetujui.</p>
              <div className="h-20"></div>
              <div className="w-32 mx-auto border-b"></div>
            </div>
            
            <div className="w-1/2 text-center">
              <p>Yang Membuat.</p>
              <div className="h-20"></div>
              <div className="w-32 mx-auto border-b"></div>
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
