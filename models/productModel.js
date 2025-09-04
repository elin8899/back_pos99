const { pool } = require('../utiles/db') // ✅ perbaikan di sini

// Fungsi untuk menambah produk
exports.createProduct = async ({ name, price, isAvailable }) => {
  const result = await pool.query(
    `INSERT INTO products (name, price, isAvailable)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, price, isAvailable]
  )
  return result.rows[0]
}

// Fungsi untuk ambil daftar produk berdasarkan pencarian
exports.getAllProducts = async (search = '') => {
  const query = `
    SELECT pcode, name, uom
    FROM products
    WHERE name ILIKE $1
    ORDER BY name ASC
  `
  const values = [`%${search}%`]
  const result = await pool.query(query, values) // ✅ ganti ke pool.query
  return result.rows
}
