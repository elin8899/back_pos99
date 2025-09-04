const { pool } = require('../utiles/db')

const generateOrderNumber = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const { rows } = await client.query(
      `UPDATE counters
       SET seq = seq + 1
       WHERE name = 'order'
       RETURNING seq`
    )

    const seq = rows[0].seq
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const paddedSeq = seq.toString().padStart(6, '0')

    await client.query('COMMIT')
    return `ORD-${dateStr}-${paddedSeq}`
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Gagal generate nomor order:', err)
    throw err
  } finally {
    client.release()
  }
}

module.exports = generateOrderNumber
