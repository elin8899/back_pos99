require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ ERROR:', err.message)
  } else {
    console.log('✅ CONNECTED! Server time:', res.rows[0])
  }
  pool.end()
})
