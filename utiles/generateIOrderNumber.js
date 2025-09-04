const db = require('../utiles/db') // sesuaikan dengan koneksi pg kamu

const generateOrderNumber = async () => {
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')

    // Coba update dulu
    const updateResult = await client.query(
      `UPDATE counters SET seq = seq + 1 WHERE name = 'order' RETURNING seq`
    )

    let seq
    if (updateResult.rows.length === 0) {
      // Jika belum ada row 'order', insert dulu
      const insertResult = await client.query(
        `INSERT INTO counters (name, seq) VALUES ('order', 1) RETURNING seq`
      )
      seq = insertResult.rows[0].seq
    } else {
      seq = updateResult.rows[0].seq
    }

    await client.query('COMMIT')

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const paddedSeq = seq.toString().padStart(6, '0')
    return `ORD-${dateStr}-${paddedSeq}`
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

module.exports = generateOrderNumber
