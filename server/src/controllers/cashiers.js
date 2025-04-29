const { pool } = require('../config/db');

// get all cashiers
const getAllCashiers = async (req, res) => {
  try {
    // default to showing only active cashiers
    const showDeleted = req.query.deleted === 'true';
    
    // query get cashiers with flag indicating if they're associated in a transaction
    let query;
    
    if (showDeleted) {
      // Include deleted cashiers
      query = `
        SELECT 
          c.*,
          IF(COUNT(t.id) > 0, TRUE, FALSE) as has_transactions
        FROM cashiers c
        LEFT JOIN transactions t ON c.id = t.cashier_id
        GROUP BY c.id
      `;
    } else {
      // only active cashiers
      query = `
        SELECT 
          c.*,
          IF(COUNT(t.id) > 0, TRUE, FALSE) as has_transactions
        FROM cashiers c
        LEFT JOIN transactions t ON c.id = t.cashier_id
        WHERE c.deleted_at IS NULL
        GROUP BY c.id
      `;
    }
    
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a new cashier
const createCashier = async (req, res) => {
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
};

// update a cashier
const updateCashier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    
    const [result] = await pool.query(
      'UPDATE cashiers SET name = ? WHERE id = ?',
      [name, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'cashier not found' });
    }
    
    res.json({ id: parseInt(id), name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// soft delete a cashier
const deleteCashier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // set deleted_at timestamp instead of actually deleting
    const [result] = await pool.query(
      'UPDATE cashiers SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'cashier not found' });
    }
    
    res.json({ message: 'cashier archived successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// restore a previously deleted cashier
const restoreCashier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // clear the deleted_at timestamp to restore
    const [result] = await pool.query(
      'UPDATE cashiers SET deleted_at = NULL WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'cashier not found' });
    }
    
    res.json({ message: 'cashier restored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCashiers,
  createCashier,
  updateCashier,
  deleteCashier,
  restoreCashier
};
