const { createProduct, getAllProducts } = require('../models/productModel')

// POST /api/products
exports.product_add = async (req, res) => {
  try {
    const { name, price, isAvailable } = req.body

    if (!name || price == null) {
      return res.status(400).json({ message: 'Nama dan harga wajib diisi' })
    }

    const newProduct = await createProduct({
      name,
      price,
      isAvailable,
    })

    res.status(201).json(newProduct)
  } catch (error) {
    console.error('Gagal simpan produk:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/products?search=ayam
exports.product_list = async (req, res) => {
  try {
    const search = req.query.search || ''
    const products = await getAllProducts(search)
    res.json(products)
  } catch (error) {
    console.error('Gagal ambil produk:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}
