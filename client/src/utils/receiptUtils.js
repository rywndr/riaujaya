// opens and handles receipt printing
export const printReceipt = (receiptRef) => {
  if (!receiptRef.current) return;

  // crude but effective mobile check
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // open the print window synchronously on click
  const printWindow = window.open('', '_blank', 'height=600,width=800');

  // grab all CSS
  const styles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch {
        // ignore cross‑origin sheets
        return '';
      }
    })
    .join('\n');

  // get receipt html
  const receiptContent = receiptRef.current.innerHTML;

  // write the full document with conditional close
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>PT.RIAUJAYA CEMERLANG SUZUKI - Receipt</title>
        <style>${styles}</style>
        <style>
          @media print {
            body { padding:0; margin:0; background:#fff!important; color:#000!important; }
            .no-print { display:none!important; }
          }
          body { font-family:Arial, sans-serif; background:#fff; color:#000; }
        </style>
      </head>
      <body class="bg-white text-black"
            onload="
              window.print();
              ${!isMobile ? 'setTimeout(() => window.close(), 500);' : ''}
            ">
        <div class="receipt-content">
          ${receiptContent}
        </div>
      </body>
    </html>
  `);

  // close document so onload will fire
  printWindow.document.close();
};

// prepare transaction data for receipt viewing
export const prepareReceiptData = (transaction, items) => {
  // format cart items for receipt component
  const formattedCart = items.map(item => ({
    product_id: item.product_id,
    product_name: item.product_name,
    product_code: item.product_code || 'N/A',
    unit_price: parseFloat(item.unit_price || 0),
    quantity: parseInt(item.quantity || 0),
    discount_percentage: parseFloat(item.discount_percentage || 0),
    total_price: parseFloat(item.subtotal || 0)
  }));
  
  // create transaction object for receipt
  const receiptTransaction = {
    id: transaction.id,
    sales_number: transaction.sales_number,
    transaction_date: transaction.transaction_date,
    customer_name: transaction.customer_name,
    customer_phone: transaction.customer_phone,
    cashier_name: transaction.cashier_name,
    subtotal: parseFloat(transaction.subtotal || 0),
    discount: parseFloat(transaction.discount || 0),
    total: parseFloat(transaction.total_amount || 0),
    notes: transaction.notes,
    printed_by: transaction.printed_by
  };
  
  return {
    formattedCart,
    receiptTransaction
  };
};
