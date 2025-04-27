const { pool } = require('../config/db');

// get all cashiers
const getAllCashiers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cashiers');
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

// delete a cashier
const deleteCashier = async (req, res) => {
  try {
    const { id } = req.params;
    
    // check if cashier is used in any transactions
    const [transactions] = await pool.query(
      'SELECT COUNT(*) as count FROM transactions WHERE cashier_id = ?',
      [id]
    );
    
    if (transactions[0].count > 0) {
      return res.status(400).json({ 
        error: 'cannot delete cashier with associated transactions' 
      });
    }
    
    const [result] = await pool.query(
      'DELETE FROM cashiers WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'cashier not found' });
    }
    
    res.json({ message: 'cashier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCashiers,
  createCashier,
  updateCashier,
  deleteCashier
};
