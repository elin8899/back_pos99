const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { pool } = require('../utiles/db');  
const bcrypt = require('bcryptjs');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,   // = idweb
      custId: user.idcust,       // = idcust
      custname: user.custname,   // ✅ tambahkan ini
      role: user.role
    },
    process.env.SECRET,
    { expiresIn: '1h' }
  )
}



exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await UserModel.findUserByUsername(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await UserModel.createUser({ username, password });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    // ✅ Tambahkan info user untuk frontend
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        custname: user.custname,
        custId: user.idcust,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.profile = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users WHERE id = $1', [req.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.setPassword = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password harus diisi' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, username]
    );

    res.json({ message: 'Password berhasil diperbarui' });
  } catch (error) {
    console.error('Set Password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.checkPasswordStatus = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username wajib diisi' });
  }

  try {
    const result = await pool.query(
      'SELECT password FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const user = result.rows[0];
    const hasPassword = !!user.password; // true kalau sudah punya password

    res.json({ hasPassword });
  } catch (error) {
    console.error('Check password status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


