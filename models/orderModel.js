const db = require('../utiles/db')
const generateOrderNumber = require('../utiles/generateIOrderNumber')

exports.createOrder = async ({ customer, custId, custidweb, items }) => { 
  if (!items || items.length === 0 || !customer) {
    throw new Error('Data pesanan tidak lengkap')
  }

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.price || 0)
    return sum + price * item.qty
  }, 0)

  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')

    const orderNo = await generateOrderNumber()

    const orderRes = await client.query(
      `INSERT INTO orders (order_no, customer, custid, custidweb, total_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, order_no`,
      [orderNo, customer, custId, custidweb, totalAmount]
    )
    const orderId = orderRes.rows[0].id

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, quantity, price, uom)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.pcode, item.name, item.qty, item.price || 0, item.uom]
      )
    }

    await client.query('COMMIT')

    return {
      id: orderId,
      order_no: orderRes.rows[0].order_no,
      message: 'Pesanan berhasil disimpan'
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

exports.getAllOrders = async () => {
  const result = await db.pool.query(`
    SELECT id, order_no, customer, order_date, total_amount, status
    FROM orders
    ORDER BY order_date DESC
  `)
  return result.rows
}

exports.getOrdersByCustomer = async (customerId) => {
  const res = await db.pool.query(`
    SELECT id, order_no, customer, order_date, total_amount, status
    FROM orders
    WHERE custidweb = $1
    ORDER BY order_date DESC
  `, [customerId])

  return res.rows
}

exports.getOrderById = async (orderId) => {
  const orderRes = await db.pool.query(`
    SELECT id, order_no, customer, order_date, total_amount, status
    FROM orders
    WHERE id = $1
  `, [orderId])

  if (orderRes.rows.length === 0) return null

  const itemsRes = await db.pool.query(`
    SELECT product_id, name, quantity, price, uom
    FROM order_items
    WHERE order_id = $1
  `, [orderId])

  return {
    ...orderRes.rows[0],
    items: itemsRes.rows
  }
}

exports.getOrdersByCustomerAndDateRange = async (customerId, startDate, endDate) => {
  console.log('💡 Filter untuk laporan:', { customerId, startDate, endDate })

  // Validasi awal
  if (!startDate || !endDate) {
    throw new Error('Tanggal mulai dan akhir wajib diisi')
  }

  const result = await db.pool.query(
    `
    SELECT id, order_no, customer, order_date, total_amount, status
    FROM orders
    WHERE custidweb = $1
      AND order_date >= $2::date
      AND order_date <= $3::date + INTERVAL '1 day' - INTERVAL '1 second'
    ORDER BY order_date DESC
    `,
    [customerId, startDate, endDate]
  )

  return result.rows
}


