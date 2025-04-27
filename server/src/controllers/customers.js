const { pool } = require('../config/db');

// get all customers
const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone are required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO customers (name, phone) VALUES (?, ?)',
      [name, phone]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      name,
      phone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a customer
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone are required' });
    }
    
    const [result] = await pool.query(
      'UPDATE customers SET name = ?, phone = ? WHERE id = ?',
      [name, phone, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'customer not found' });
    }
    
    res.json({ 
      id: parseInt(id), 
      name, 
      phone 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // check if customer is used in any transactions
    const [transactions] = await pool.query(
      'SELECT COUNT(*) as count FROM transactions WHERE customer_id = ?',
      [id]
    );
    
    if (transactions[0].count > 0) {
      return res.status(400).json({ 
        error: 'cannot delete customer with associated transactions' 
      });
    }
    
    const [result] = await pool.query(
      'DELETE FROM customers WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'customer not found' });
    }
    
    res.json({ message: 'customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
