const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wajib untuk Neon
  }
});

// Fungsi koneksi awal
const dbConnect = async () => {
  try {
    await pool.query('SELECT 1'); // Ping awal
    console.log('✅ Database Connected (PostgreSQL/Neon)...');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
};

// Ekspor fungsi dan pool
module.exports = {
  dbConnect,
  pool,
};
