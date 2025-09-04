require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { dbConnect, pool } = require('./utiles/db'); // pastikan export pool dari db.js
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Route tambahan untuk ping dari luar (opsional)
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

(async () => {
  try {
    await dbConnect(); // koneksi ke PostgreSQL
    console.log('✅ PostgreSQL connected');

    // ✅ Keep Neon connection alive every 4 minutes
    setInterval(async () => {
      try {
        await pool.query('SELECT 1');
        console.log('🔁 Ping successful (Neon connection alive)');
      } catch (err) {
        console.error('⚠️ Ping failed:', err.message);
      }
    }, 4 * 60 * 1000); // setiap 4 menit

    app.get('/', (req, res) => {
      res.send('Hello Server...');
    });

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
  }
})();
