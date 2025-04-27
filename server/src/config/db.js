const mysql = require('mysql2/promise');

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

// health check function
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return { status: 'ok', message: 'database connection successful' };
  }
  catch (error) {
    return { status: 'error', message: error.message };
  }
};

module.exports = {
  pool,
  testConnection
};
