const { pool } = require('../config/db');

// get all products
const getAllProducts = async (req, res) => {
  try {
    // default to showing only active products
    const showDeleted = req.query.deleted === 'true';
    
    // query get products with a flag indicating if they're associaeted in a transaction
    let query;
    
    if (showDeleted) {
      // include deleted products
      query = `
        SELECT 
          p.*,
          IF(COUNT(ti.id) > 0, TRUE, FALSE) as has_transactions
        FROM products p
        LEFT JOIN transaction_items ti ON p.id = ti.product_id
        GROUP BY p.id
      `;
    } else {
      // only active products
      query = `
        SELECT 
          p.*,
          IF(COUNT(ti.id) > 0, TRUE, FALSE) as has_transactions
        FROM products p
        LEFT JOIN transaction_items ti ON p.id = ti.product_id
        WHERE p.deleted_at IS NULL
        GROUP BY p.id
      `;
    }
    
    const [rows] = await pool.query(query);
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

// soft delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // set deleted_at timestamp instead of actually deleting
    const [result] = await pool.query(
      'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'product not found' });
    }
    
    res.json({ message: 'product archived successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// restore a previously deleted product
const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // clear the deleted_at timestamp to restore
    const [result] = await pool.query(
      'UPDATE products SET deleted_at = NULL WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'product not found' });
    }
    
    res.json({ message: 'product restored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
};
