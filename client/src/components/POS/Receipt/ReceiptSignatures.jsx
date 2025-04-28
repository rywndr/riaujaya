import React from 'react';

const ReceiptSignatures = () => {
  return (
    <div className="flex mt-28 w-full">
      <SignatureBlock title="Yang Menerima." />
      
      <div className="w-2/3 flex justify-end">
        <SignatureBlock title="Yang Menyetujui." customClass="w-1/2 pr-4" />
        <SignatureBlock title="Yang Membuat." customClass="w-1/2" />
      </div>
    </div>
  );
};

const SignatureBlock = ({ title, customClass = "w-1/3" }) => (
  <div className={`${customClass} text-center`}>
    <p>{title}</p>
    <div className="h-20"></div>
    <div className="w-32 mx-auto border-b"></div>
  </div>
);

export default ReceiptSignatures;
