import React from 'react';
import { formatDate } from '../../../utils/formatters';

const ReceiptHeader = ({ currentTransaction }) => {
  return (
    <div className="flex mb-8">
      {/* company info */}
      <div className="w-1/2">
        <div className="text-2xl font-bold">PT.RIAUJAYA CEMERLANG</div>
        <div className="text-sm">JL. NANGKA/TUANKU TAMBUSAI Blok - No.18 J.K.L RT:000 RW:000</div>
        <div className="text-sm">Kel.TAMPAN Kec.PAYUNG SEKAKI Kota/Kab.PE</div>
        <div className="mt-4">
          <InfoItem label="SALES NO" value={currentTransaction.sales_number} />
          <InfoItem 
            label="TANGGAL" 
            value={formatDate(currentTransaction.transaction_date)} 
          />
        </div>
      </div>
      
      {/* customer info */}
      <div className="w-1/2 pl-48">
        <div className="mt-3">
          <InfoItem label="Kepada" value={currentTransaction.customer_name} />
          <div className="flex">
            <span className="w-24 inline-block"></span>
            <span className="ml-[10px]">TANJUNGPINANG</span>
          </div>
          <div>&nbsp;</div>
          <InfoItem label="Telepon" value={currentTransaction.customer_phone} />
          <InfoItem label="Sales" value={currentTransaction.cashier_name} />
        </div>
      </div>
    </div>
  );
};

// helper component for consistent info item formatting
const InfoItem = ({ label, value }) => (
  <div className="flex">
    <span className="w-24 inline-block"><strong>{label}</strong></span>
    <span className="inline-block"><strong>:</strong> {value}</span>
  </div>
);

export default ReceiptHeader;
