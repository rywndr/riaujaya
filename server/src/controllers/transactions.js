const { pool } = require('../config/db');

// helper function to format date in +0700
const formatTime = (date) => {
  // create date object if string is provided
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');
};

// get all transactions
const getAllTransactions = async (req, res) => {
  try {
    // get transactions with cashier and customer names
    const [rows] = await pool.query(`
      SELECT 
        t.*,
        c.name as cashier_name, 
        COALESCE(cust.name, 'KONSUMEN BENGKEL') as customer_name,
        cust.phone as customer_phone
      FROM transactions t
      LEFT JOIN cashiers c ON t.cashier_id = c.id
      LEFT JOIN customers cust ON t.customer_id = cust.id
      ORDER BY t.transaction_date DESC
    `);
    
    const formattedRows = rows.map(row => ({
      ...row,
      transaction_date: formatTime(row.transaction_date)
    }));
    
    res.json(formattedRows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get transaction with items by id
const getTransactionById = async (req, res) => {
  try {
    const transactionId = req.params.id;
    
    // get transaction details with joined names
    const [transactions] = await pool.query(
      `SELECT 
        t.*,
        c.name as cashier_name, 
        COALESCE(cust.name, 'KONSUMEN BENGKEL') as customer_name, 
        cust.phone as customer_phone
      FROM transactions t
      LEFT JOIN cashiers c ON t.cashier_id = c.id
      LEFT JOIN customers cust ON t.customer_id = cust.id
      WHERE t.id = ?`,
      [transactionId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({ error: 'transaction not found' });
    }
    
    // get transaction items with product info
    const [items] = await pool.query(
      `SELECT 
        ti.*, 
        p.name as product_name, 
        p.code as product_code
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      WHERE ti.transaction_id = ?`,
      [transactionId]
    );
    
    const transaction = {
      ...transactions[0],
      transaction_date: formatTime(transactions[0].transaction_date)
    };
    
    res.json({
      transaction: transaction,
      items: items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create transaction with transaction items
const createTransaction = async (req, res) => {
  // start a transaction to ensure data consistency
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      sales_number,
      cashier_id,
      customer_name,
      customer_phone,
      subtotal,
      discount,
      total,
      notes,
      printed_by,
      cart
    } = req.body;
    
    // validate required fields
    if (!sales_number || !cashier_id || !customer_name || cart.length === 0) {
      return res.status(400).json({ 
        error: 'sales_number, cashier_id, customer_name and cart items are required' 
      });
    }
    
    // create customer logic
    let customer_id = null;
    
    if (customer_name !== "KONSUMEN BENGKEL") {
      if (customer_phone && customer_phone.trim() !== '') {
        // check if customer exists with this phone
        const [existingCustomersByPhone] = await connection.query(
          'SELECT id FROM customers WHERE phone = ?',
          [customer_phone]
        );
        
        if (existingCustomersByPhone.length > 0) {
          customer_id = existingCustomersByPhone[0].id;
        } else {
          // create new customer with phone
          const [customerResult] = await connection.query(
            'INSERT INTO customers (name, phone) VALUES (?, ?)',
            [customer_name, customer_phone]
          );
          customer_id = customerResult.insertId;
        }
      } else {
        // no phone provided then create customer with just name
        const [customerResult] = await connection.query(
          'INSERT INTO customers (name) VALUES (?)',
          [customer_name]
        );
        customer_id = customerResult.insertId;
      }
    }
    
    // get current time for transaction_date
    const Time = formatTime(new Date());
    
    // insert transaction with explicit time
    const [transactionResult] = await connection.query(
      `INSERT INTO transactions 
       (sales_number, cashier_id, customer_id, total_amount, notes, printed_by, transaction_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sales_number, cashier_id, customer_id, total, notes, printed_by, Time]
    );
    
    const transaction_id = transactionResult.insertId;
    
    // insert transaction items
    for (const item of cart) {
      // calculate the correct pre-discount subtotal
      const itemSubtotal = item.quantity * item.unit_price;
      
      await connection.query(
        `INSERT INTO transaction_items 
         (transaction_id, product_id, quantity, unit_price, discount_percentage, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transaction_id,
          item.product_id,
          item.quantity, 
          item.unit_price,
          item.discount_percentage || 0,
          itemSubtotal // using pre-discount subtotal
        ]
      );
    }
    
    // commit the transaction
    await connection.commit();
    
    // fetch the complete transaction with items and names
    const [transactionData] = await connection.query(
      `SELECT t.*, c.name as cashier_name, 
       COALESCE(cust.name, 'KONSUMEN BENGKEL') as customer_name, 
       cust.phone as customer_phone
       FROM transactions t
       LEFT JOIN cashiers c ON t.cashier_id = c.id
       LEFT JOIN customers cust ON t.customer_id = cust.id
       WHERE t.id = ?`,
      [transaction_id]
    );
    
    const [transactionItems] = await connection.query(
      `SELECT ti.*, p.name as product_name, p.code as product_code
       FROM transaction_items ti
       JOIN products p ON ti.product_id = p.id
       WHERE ti.transaction_id = ?`,
      [transaction_id]
    );
    
    const transaction = {
      ...transactionData[0],
      transaction_date: formatTime(transactionData[0].transaction_date)
    };
    
    res.status(201).json({
      transaction: transaction,
      items: transactionItems
    });
  } catch (error) {
    // rollback in case of error
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// update transaction
const updateTransaction = async (req, res) => {
  // start a transaction to ensure data consistency
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const transactionId = req.params.id;
    const {
      sales_number,
      cashier_id,
      customer_name,
      customer_phone,
      total,
      notes,
      printed_by,
      cart
    } = req.body;
    
    // validate required fields
    if (!sales_number || !cashier_id || !customer_name || cart.length === 0) {
      return res.status(400).json({ 
        error: 'sales_number, cashier_id, customer_name and cart items are required' 
      });
    }
    
    // make sure transaction exists
    const [existingTransaction] = await connection.query(
      'SELECT id FROM transactions WHERE id = ?',
      [transactionId]
    );
    if (existingTransaction.length === 0) {
      return res.status(404).json({ error: 'transaction not found' });
    }
    
    // handle customer info - updated to make phone number optional
    let customer_id = null;
    
    // Skip the default "KONSUMEN BENGKEL" to create a record for custom name
    if (customer_name !== "KONSUMEN BENGKEL") {
      // If phone is provided, try to look up customer by phone
      if (customer_phone && customer_phone.trim() !== '') {
        // check if customer exists with this phone
        const [existingCustomersByPhone] = await connection.query(
          'SELECT id FROM customers WHERE phone = ?',
          [customer_phone]
        );
        
        if (existingCustomersByPhone.length > 0) {
          customer_id = existingCustomersByPhone[0].id;
        } else {
          // create new customer with phone
          const [customerResult] = await connection.query(
            'INSERT INTO customers (name, phone) VALUES (?, ?)',
            [customer_name, customer_phone]
          );
          customer_id = customerResult.insertId;
        }
      } else {
        // No phone provided - create customer with just name
        const [customerResult] = await connection.query(
          'INSERT INTO customers (name) VALUES (?)',
          [customer_name]
        );
        customer_id = customerResult.insertId;
      }
    }
    
    // update transaction (keeping original transaction_date)
    await connection.query(
      `UPDATE transactions 
       SET sales_number = ?, 
           cashier_id = ?, 
           customer_id = ?, 
           total_amount = ?, 
           notes = ?, 
           printed_by = ?
       WHERE id = ?`,
      [sales_number, cashier_id, customer_id, total, notes, printed_by, transactionId]
    );
    
    // delete existing items
    await connection.query(
      'DELETE FROM transaction_items WHERE transaction_id = ?',
      [transactionId]
    );
    
    // insert updated items
    for (const item of cart) {
      const itemSubtotal = item.quantity * item.unit_price;
      
      await connection.query(
        `INSERT INTO transaction_items 
         (transaction_id, product_id, quantity, unit_price, discount_percentage, subtotal) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          transactionId,
          item.product_id,
          item.quantity, 
          item.unit_price,
          item.discount_percentage || 0,
          itemSubtotal
        ]
      );
    }
    
    // commit the transaction
    await connection.commit();
    
    // fetch the updated transaction with items and names
    const [transactionData] = await connection.query(
      `SELECT t.*, c.name as cashier_name, 
       COALESCE(cust.name, 'KONSUMEN BENGKEL') as customer_name, 
       cust.phone as customer_phone
       FROM transactions t
       LEFT JOIN cashiers c ON t.cashier_id = c.id
       LEFT JOIN customers cust ON t.customer_id = cust.id
       WHERE t.id = ?`,
      [transactionId]
    );
    
    const [transactionItems] = await connection.query(
      `SELECT ti.*, p.name as product_name, p.code as product_code
       FROM transaction_items ti
       JOIN products p ON ti.product_id = p.id
       WHERE ti.transaction_id = ?`,
      [transactionId]
    );
    
    const transaction = {
      ...transactionData[0],
      transaction_date: formatTime(transactionData[0].transaction_date)
    };
    
    res.json({
      transaction: transaction,
      items: transactionItems
    });
  } catch (error) {
    // rollback in case of error
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

// delete transaction
const deleteTransaction = async (req, res) => {
  // start a transaction to ensure data consistency
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const transactionId = req.params.id;
    
    // delete transaction items first (foreign key constraint)
    await connection.query(
      'DELETE FROM transaction_items WHERE transaction_id = ?',
      [transactionId]
    );
    
    // delete transaction
    const [result] = await connection.query(
      'DELETE FROM transactions WHERE id = ?',
      [transactionId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'transaction not found' });
    }
    
    // commit the transaction
    await connection.commit();
    
    res.json({ message: 'transaction deleted successfully' });
  } catch (error) {
    // rollback in case of error
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
