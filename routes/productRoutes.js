const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const { authMiddleware } = require('../middlewares/auth')

// Tanpa auth:
router.post('/', authMiddleware, productController.product_add)
router.get('/', authMiddleware, productController.product_list)   

module.exports = router
