const { pool } = require('../config/db');

// get all products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new product
const createProduct = async (req, res) => {
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
};

// update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit_price, code } = req.body;
    
    if (!name || !unit_price || !code) {
      return res.status(400).json({ error: 'name, unit_price, and code are required' });
    }
    
    const [result] = await pool.query(
      'UPDATE products SET name = ?, unit_price = ?, code = ? WHERE id = ?',
      [name, unit_price, code, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'product not found' });
    }
    
    res.json({ 
      id: parseInt(id), 
      name, 
      unit_price, 
      code 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // check if product is used in any transaction items
    const [transactionItems] = await pool.query(
      'SELECT COUNT(*) as count FROM transaction_items WHERE product_id = ?',
      [id]
    );
    
    if (transactionItems[0].count > 0) {
      return res.status(400).json({ 
        error: 'cannot delete product with associated transactions' 
      });
    }
    
    const [result] = await pool.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'product not found' });
    }
    
    res.json({ message: 'product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
