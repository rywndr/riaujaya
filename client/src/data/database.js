const db = (() => {
  const cashiers = [
    { id: 1, name: 'Haikhal Roywendra' },
    { id: 2, name: 'Maria Febrianti' },
    { id: 3, name: 'John Doe' }
  ];

  const products = [
    { id: 1, name: 'Oli Mesin SGO Suzuki', unit_price: 75000, code: '9900079992101' },
    { id: 2, name: 'Filter Udara Satria FU', unit_price: 45000, code: '9900079992102' },
    { id: 3, name: 'Busi Iridium GSX-R150', unit_price: 120000, code: '9900079992103' },
    { id: 4, name: 'Kampas Rem Depan Nex', unit_price: 60000, code: '9900079992104' },
    { id: 5, name: 'Oli Gardan Suzuki', unit_price: 35000, code: '9900079992105' }
  ];

  return { 
    cashiers, 
    products, 
    customers: [], 
    transactions: [], 
    transaction_items: [] 
  };
})();

export default db;
