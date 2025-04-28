import React from 'react';

const ReceiptSummary = ({ currentTransaction }) => {
  return (
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
        <TotalRow 
          label="TOTAL"
          value={`IDR ${currentTransaction.subtotal.toLocaleString('id-ID')}`}
        />

        <TotalRow 
          label="DISCOUNT"
          value={currentTransaction.discount > 0
            ? `IDR ${currentTransaction.discount.toLocaleString('id-ID')}`
            : 'IDR '
          }
        />
        
        <div className="w-64 ml-auto border-t mt-2 pt-2"></div>
        
        <TotalRow 
          label="GRAND TOTAL"
          value={`IDR ${currentTransaction.total.toLocaleString('id-ID')}`}
          isBold={true}
        />
      </div>
    </div>
  );
};

// reusable component for total rows
const TotalRow = ({ label, value, isBold = false }) => (
  <div className={`flex justify-end mb-1 ${isBold ? 'font-bold mb-8' : ''}`}>
    <span className="w-28 text-left">{label}</span>
    <span className="w-6 text-center">:</span>
    <span className="w-36 text-left">{value}</span>
  </div>
);

export default ReceiptSummary;
