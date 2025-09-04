const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByCustomerAndDateRange,
} = require('../models/orderModel')

exports.orders_by_customer = async (req, res) => {
  try {
    const customerId = req.user?.username || req.body.custidweb // tergantung dari middleware

    console.log('Customer', customerId)
    if (!customerId) return res.status(401).json({ message: 'Unauthorized' })

    const orders = await getOrdersByCustomer(customerId)
    res.json(orders)
  } catch (err) {
    console.error('🔴 ERROR orders_by_customer:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

exports.order_add = async (req, res) => {
  try {
    const order = await createOrder(req.body)
    res.status(201).json(order)
  } catch (err) {
    console.error('Gagal buat order:', err.message)
    res.status(500).json({ message: 'Gagal buat order' })
  }
}

exports.order_list = async (req, res) => {
  try {
    const orders = await getAllOrders()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.order_detail = async (req, res) => {
  console.log('masuk order detail')
  try {
    const order = await getOrderById(req.params.id)
    if (!order)
      return res.status(404).json({ message: 'Order tidak ditemukan' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.orders_by_date_range = async (req, res) => {
  console.log('✅ Masuk route: orders_by_date_range')
  try {
    const customerId = req.user?.username || req.body.custidweb
    const { start, end } = req.query

    console.log('🔍 Params:', { customerId, start, end })

    if (!customerId || !start || !end) {
      return res.status(400).json({ message: 'Missing required parameters' })
    }

    const orders = await getOrdersByCustomerAndDateRange(customerId, start, end)
    res.json(orders)
  } catch (err) {
    console.error('❌ ERROR orders_by_date_range:', err.message)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

