const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// test database connection
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'ok', message: 'database connection successful' });
  }
  catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// cashiers endpoints
app.get('/api/cashiers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cashiers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cashiers', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO cashiers (name) VALUES (?)',
      [name]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// products endpoints
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, unit_price, code } = req.body;
    if (!name || !unit_price || !code) {
      return res.status(400).json({ error: 'name, unit_price, and code are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO products (name, unit_price, code) VALUES (?, ?, ?)',
      [name, unit_price, code]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      unit_price,
      code
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// customers endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// transactions endpoints - with improved data fetching
app.get('/api/transactions', async (req, res) => {
  try {
    // Get transactions with cashier and customer names
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
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get transaction with items by id
app.get('/api/transactions/:id', async (req, res) => {
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
    
    res.json({
      transaction: transactions[0],
      items: items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction with transaction items
app.post('/api/transactions', async (req, res) => {
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
    
    // create customer if phone number is provided
    let customer_id = null;
    if (customer_phone) {
      // check if customer exists
      const [existingCustomers] = await connection.query(
        'SELECT id FROM customers WHERE phone = ?',
        [customer_phone]
      );
      
      if (existingCustomers.length > 0) {
        customer_id = existingCustomers[0].id;
      } else {
        // create new customer
        const [customerResult] = await connection.query(
          'INSERT INTO customers (name, phone) VALUES (?, ?)',
          [customer_name, customer_phone]
        );
        customer_id = customerResult.insertId;
      }
    }
    
    // insert transaction
    const [transactionResult] = await connection.query(
      `INSERT INTO transactions 
       (sales_number, cashier_id, customer_id, total_amount, notes, printed_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sales_number, cashier_id, customer_id, total, notes, printed_by]
    );
    
    const transaction_id = transactionResult.insertId;
    
    // insert transaction items
    for (const item of cart) {
      // Calculate the correct pre-discount subtotal
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
          itemSubtotal // Using pre-discount subtotal
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
    
    res.status(201).json({
      transaction: transactionData[0],
      items: transactionItems
    });
  } catch (error) {
    // rollback in case of error
    await connection.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
