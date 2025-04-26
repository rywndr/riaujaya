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
  host: process.env.DB_HOST
  user: process.env.DB_USER
  password: process.env.DB_PASSWORD
  database: process.env.DB_NAME
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
  } catch (error) {
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

// transactions endpoints
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM transactions');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
