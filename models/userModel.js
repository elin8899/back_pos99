const { pool } = require('../utiles/db');
const bcrypt = require('bcryptjs');

// 🔐 Buat user baru (hash password)
async function createUser({ username, password, role = 'user' }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (username, password, role)
     VALUES ($1, $2, $3)
     RETURNING id, username, role`,
    [username, hashedPassword, role]
  );

  return result.rows[0];
}

// 🔍 Cari user berdasarkan username
async function findUserByUsername(username) {
  const result = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0]; // bisa null kalau tidak ditemukan
}

// 🔐 Bandingkan password input vs hash
async function comparePassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

module.exports = {
  createUser,
  findUserByUsername,
  comparePassword
};
